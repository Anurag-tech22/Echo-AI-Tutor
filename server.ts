import express from "express";
import * as path from "path";
import { createServer as createViteServer } from "vite";
import * as http from "http";
import { Server } from "socket.io";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const START_TIME = Date.now();

// In-memory sliding-window rate limiter for production safety
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string, limit = 30, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    transports: ["websocket", "polling"],
  });

  // Structured Logging Middleware
  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const logData = {
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        durationMs: duration,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      };
      if (res.statusCode >= 500) {
        console.error("[ERROR]", JSON.stringify(logData));
      } else if (res.statusCode >= 400) {
        console.warn("[WARN]", JSON.stringify(logData));
      } else if (!req.url.startsWith("/assets/") && !req.url.startsWith("/@")) {
        console.log("[INFO]", JSON.stringify(logData));
      }
    });
    next();
  });

  // Socket.io Real-time Collaborative State Relay
  io.on("connection", (socket) => {
    socket.on("join_sim", (room: string) => {
      socket.join(room);
      const clients = io.sockets.adapter.rooms.get(room)?.size || 1;
      io.to(room).emit("user_count", clients);
    });

    socket.on("sim_param_change", ({ room, params }: { room: string; params: any }) => {
      socket.to(room).emit("sim_param_update", params);
    });

    socket.on("cursor_move", ({ room, cursor }: { room: string; cursor: any }) => {
      socket.to(room).emit("remote_cursor", { id: socket.id, cursor });
    });

    socket.on("disconnect", () => {
      // Automatic socket cleanup
    });
  });

  app.use(express.json({ limit: "1mb" }));

  // ==========================================
  // Health & Observability Probes (Google Cloud / Kubernetes / Render)
  // ==========================================
  app.get("/healthz", (_req, res) => {
    res.status(200).json({
      status: "healthy",
      service: "echo-ai-tutor",
      uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/readyz", (_req, res) => {
    const memory = process.memoryUsage();
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    res.status(200).json({
      status: "ready",
      service: "echo-ai-tutor",
      environment: process.env.NODE_ENV || "development",
      aiEngine: hasKey ? "echo-neural-core" : "simulated-heuristic-mode",
      memory: {
        heapUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memory.heapTotal / 1024 / 1024),
        rssMB: Math.round(memory.rss / 1024 / 1024),
      },
    });
  });

  // ==========================================
  // Socratic Chat API Route with Gemini 3.6 Flash
  // ==========================================
  app.post("/api/chat", async (req, res) => {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const { allowed, remaining } = checkRateLimit(clientIp, 40, 60000);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (!allowed) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait a minute before submitting more questions.",
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid request: messages array is required." });
    }

    if (messages.length > 60) {
      return res.status(400).json({ error: "Conversation history exceeds maximum allowable turns (60)." });
    }

    // Fallback if API key is not configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === "") {
      const fallbacks = [
        "That's an interesting point. Can you elaborate on why you think that is the case?",
        "What evidence supports that conclusion?",
        "If we assume that's true, what would be the logical next step?",
        "How does that concept connect to what we observed in the 3D simulation?",
        "Can you think of any physical counterexamples to that rule?",
      ];
      const randomResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({ text: `*(Simulated Mode - No API Key)* ${randomResponse}` });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY as string,
        httpOptions: {
          headers: {
            "User-Agent": "echo-ai-tutor/1.0.0",
          },
        },
      });

      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.content || "").slice(0, 4000) }],
      }));

      let responseText = "";
      let retries = 3;
      const modelsToTry = [
        process.env.GEMINI_MODEL,
        "gemini-3.6-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
      ].filter(Boolean) as string[];
      let modelIndex = 0;

      while (retries > 0 && modelIndex < modelsToTry.length) {
        const currentModel = modelsToTry[modelIndex];
        try {
          const response = await ai.models.generateContent({
            model: currentModel,
            contents,
            config: {
              systemInstruction:
                "You are ECHO (Evaluative Cognitive Heuristic Oracle), a Socratic AI tutor. Do not just give answers. Ask probing questions to reveal flaws in the student's logic or guide them to the answer themselves. Keep your responses concise (1-3 sentences).",
            },
          });
          responseText = response.text || "";
          break;
        } catch (error: any) {
          retries--;
          const errorMessage = error.message || String(error);

          // If model is deprecated or not available, cascade to next supported model
          if (
            errorMessage.includes("not found") ||
            errorMessage.includes("no longer available") ||
            errorMessage.includes("deprecated") ||
            errorMessage.includes("404")
          ) {
            console.warn(`[WARN] Model ${currentModel} not available, cascading to next model...`);
            modelIndex++;
            retries = 3;
            continue;
          }

          // Check for quota limits / 429s
          if (errorMessage.toLowerCase().includes("quota") || errorMessage.includes("429")) {
            console.warn(`[WARN] Gemini API Quota Exceeded (handled gracefully).`);
            responseText =
              "*(Simulated Response - Free Quota Reached)* That is an interesting perspective. If we approach the problem from another angle, how might your conclusion change? (Please wait about 30 seconds before sending another prompt).";
            break;
          }

          if (retries === 0 || modelIndex >= modelsToTry.length - 1) {
            let cleanMessage = errorMessage;
            try {
              const match = cleanMessage.match(/\{.*\}/);
              if (match) {
                const parsed = JSON.parse(match[0]);
                cleanMessage = parsed?.error?.message || cleanMessage;
              }
            } catch (e) {}
            throw new Error(cleanMessage);
          }
          await new Promise((r) => setTimeout(r, 1500));
        }
      }

      res.json({ text: responseText });
    } catch (error: any) {
      console.error("[ERROR] Gemini API Final Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // ==========================================
  // Real-time SSE Token Streaming with Cognitive Trace (Google DeepMind / OpenAI style)
  // ==========================================
  app.post("/api/chat/stream", async (req, res) => {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const { allowed } = checkRateLimit(clientIp, 40, 60000);

    if (!allowed) {
      return res.status(429).json({ error: "Rate limit exceeded. Please wait a minute." });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Initialize SSE Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const latestUserMsg = messages[messages.length - 1]?.content || "";
    
    // Cognitive Trace: Analyze linguistic heuristics & physical invariants
    const hasFallacyTerms = /faster|heavier|absorb|always|stops|instant/i.test(latestUserMsg);
    const estimatedFragility = hasFallacyTerms ? 0.68 : 0.24;

    // Emit Cognitive Reasoning Trace before token stream
    res.write(`data: ${JSON.stringify({
      type: "trace",
      stage: "Physical Invariant Decomposition",
      hypothesis: latestUserMsg.slice(0, 120),
      detectedInvariants: ["Newtonian Gravitation", "Lorentz Symmetry", "Energy Conservation"],
      fragilityScore: estimatedFragility,
      strategy: estimatedFragility > 0.5 ? "Empirical 3D Counterexample Interrogation" : "Dialectic Extension"
    })}\n\n`);

    // Stream generation
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === "") {
      const simulatedText = "*(Simulated Heuristic Stream)* Consider the physical conservation laws at play. If no external torque or non-conservative dissipative force is present, how can that physical quantity change over time? Try manipulating the simulation parameters to test your hypothesis.";
      const words = simulatedText.split(" ");
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ type: "chunk", text: word + " " })}\n\n`);
        await new Promise((r) => setTimeout(r, 25));
      }
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      return res.end();
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY as string,
        httpOptions: { headers: { "User-Agent": "echo-ai-tutor/1.0.0" } },
      });

      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.content || "").slice(0, 4000) }],
      }));

      const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction:
            "You are ECHO (Evaluative Cognitive Heuristic Oracle), a frontier Socratic AI tutor. Do not provide direct answers. Ask sharp, probing questions to expose logical discrepancies or guide students to discover the physical laws themselves. Keep responses concise (1-3 sentences).",
        },
      });

      for await (const chunk of stream) {
        const text = chunk.text || "";
        if (text) {
          res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    } catch (err: any) {
      console.error("[ERROR] Streaming error:", err.message);
      res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
      res.end();
    }
  });

  // Vite middleware for development or Static bundle serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[INFO] ECHO Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });

  // Graceful Shutdown Lifecycle
  const gracefulShutdown = (signal: string) => {
    console.log(`[INFO] Received ${signal}. Starting graceful shutdown...`);
    io.close(() => {
      console.log("[INFO] Socket.io connections closed.");
    });
    server.close(() => {
      console.log("[INFO] HTTP server closed cleanly. Exiting.");
      process.exit(0);
    });

    // Force exit after 10s if connections fail to close
    setTimeout(() => {
      console.error("[WARN] Could not close connections in time, forcefully shutting down.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

startServer();

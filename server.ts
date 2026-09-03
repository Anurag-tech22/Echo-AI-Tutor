import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join_sim", (room) => {
      socket.join(room);
      const clients = io.sockets.adapter.rooms.get(room)?.size || 1;
      io.to(room).emit("user_count", clients);
    });

    socket.on("sim_param_change", ({ room, params }) => {
      socket.to(room).emit("sim_param_update", params);
    });

    socket.on("cursor_move", ({ room, cursor }) => {
      socket.to(room).emit("remote_cursor", { id: socket.id, cursor });
    });
    
    socket.on("disconnect", () => {
       // Optional cleanup
    });
  });
  

  app.use(express.json());

  // AI client will be initialized per-request if the key exists
  
  // API Routes
  app.post("/api/chat", async (req, res) => {
    console.log("Received chat request:", req.body);
    
    // Fallback if API key is not configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      console.log("No API key configured. Providing fallback simulated response.");
      // Provide a generic Socratic response
      const fallbacks = [
        "That's an interesting point. Can you elaborate on why you think that is the case?",
        "What evidence supports that conclusion?",
        "If we assume that's true, what would be the logical next step?",
        "How does that concept connect to what we discussed earlier?",
        "Can you think of any exceptions to that rule?"
      ];
      const randomResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({ text: `*(Simulated Mode - No API Key)* ${randomResponse}` });
    }

    try {
      const { messages } = req.body;
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY as string,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      console.log("Calling Gemini API with contents:", contents);
      let responseText = "";
      let retries = 3;
      const modelsToTry = [
        process.env.GEMINI_MODEL,
        "gemini-3.6-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash"
      ].filter(Boolean) as string[];
      let modelIndex = 0;
      
      while (retries > 0 && modelIndex < modelsToTry.length) {
        const currentModel = modelsToTry[modelIndex];
        try {
          console.log(`Calling Gemini API with model: ${currentModel}`);
          const response = await ai.models.generateContent({
            model: currentModel,
            contents,
            config: {
              systemInstruction: "You are ECHO (Evaluative Cognitive Heuristic Oracle), a Socratic AI tutor. Do not just give answers. Ask probing questions to reveal flaws in the student's logic or guide them to the answer themselves. Keep your responses concise (1-3 sentences).",
            }
          });
          responseText = response.text || "";
          break;
        } catch (error: any) {
          retries--;
          const errorMessage = error.message || String(error);
          
          // If model is deprecated or not available, cascade to next supported model
          if (errorMessage.includes('not found') || errorMessage.includes('no longer available') || errorMessage.includes('deprecated') || errorMessage.includes('404')) {
            console.warn(`Model ${currentModel} not available, cascading to next model...`);
            modelIndex++;
            retries = 3;
            continue;
          }

          // Check for quota limits / 429s
          if (errorMessage.toLowerCase().includes('quota') || errorMessage.includes('429')) {
             console.log(`Gemini API Quota Exceeded (handled gracefully).`);
             responseText = "*(Simulated Response - Free Quota Reached)* That is an interesting perspective. If we approach the problem from another angle, how might your conclusion change? (Please wait about 30 seconds before sending another real prompt).";
             break;
          }

          console.warn(`Gemini API Retry Warning (retries left: ${retries}):`, errorMessage);

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
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      console.log("Gemini API succeeded or used fallback, returning response");
      res.json({ text: responseText });
    } catch (error: any) {
      console.error('Gemini API Final Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

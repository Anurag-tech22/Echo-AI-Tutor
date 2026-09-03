# OpenAPI 3.1 Specification

```yaml
openapi: 3.1.0
info:
  title: ECHO Socratic Intelligence & Cognitive Simulation API
  description: REST and Real-time WebSocket interface for ECHO (Evaluative Cognitive Heuristic Oracle).
  version: 1.0.0
  contact:
    name: Anurag-tech22
    url: https://github.com/Anurag-tech22/Echo-AI-Tutor

servers:
  - url: http://localhost:3000
    description: Local Development / Docker Environment
  - url: https://echo-ai-tutor.onrender.com
    description: Production Cloud Deployment (Render)

paths:
  /healthz:
    get:
      summary: Liveness Probe
      description: Returns 200 OK if the Node.js event loop and server are actively serving requests.
      responses:
        '200':
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "healthy"
                  service:
                    type: string
                    example: "echo-ai-tutor"
                  uptimeSeconds:
                    type: integer
                    example: 3600
                  timestamp:
                    type: string
                    format: date-time

  /readyz:
    get:
      summary: Readiness Probe
      description: Returns 200 OK with runtime diagnostics (memory consumption, AI engine status).
      responses:
        '200':
          description: Service is ready to accept traffic
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ready"
                  service:
                    type: string
                    example: "echo-ai-tutor"
                  environment:
                    type: string
                    example: "production"
                  aiEngine:
                    type: string
                    example: "google-gemini-3.6-flash"
                  memory:
                    type: object
                    properties:
                      heapUsedMB:
                        type: integer
                      heapTotalMB:
                        type: integer
                      rssMB:
                        type: integer

  /api/chat:
    post:
      summary: Socratic Interrogation Endpoint
      description: Sends message conversation history to the Gemini 3.6 Socratic engine.
      parameters:
        - in: header
          name: X-Forwarded-For
          schema:
            type: string
          description: Client IP address used for sliding-window rate limiting.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - messages
              properties:
                messages:
                  type: array
                  items:
                    type: object
                    required:
                      - role
                      - content
                    properties:
                      role:
                        type: string
                        enum: [user, assistant, model]
                      content:
                        type: string
                        maxLength: 4000
      responses:
        '200':
          description: Socratic probe or counterexample question
          headers:
            X-RateLimit-Remaining:
              schema:
                type: integer
              description: Number of remaining requests permitted in the current 60-second window.
          content:
            application/json:
              schema:
                type: object
                properties:
                  text:
                    type: string
                    example: "What physical force accounts for the discrepancy when atmospheric drag is removed?"
        '400':
          description: Bad request (missing messages array or history > 60 turns)
        '429':
          description: Rate limit exceeded (more than 40 requests per minute)
        '500':
          description: Internal server error or Gemini API failure

  /api/chat/stream:
    post:
      summary: Real-Time SSE Socratic Token Stream with Cognitive Trace
      description: Server-Sent Events stream delivering typewriter tokens and internal cognitive invariant audits.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - messages
              properties:
                messages:
                  type: array
                  items:
                    type: object
                    properties:
                      role:
                        type: string
                      content:
                        type: string
      responses:
        '200':
          description: Real-time text/event-stream chunks
          content:
            text/event-stream:
              schema:
                type: string
                example: |
                  data: {"type":"trace","stage":"Physical Invariant Decomposition","hypothesis":"mass determines fall rate","fragilityScore":0.68,"strategy":"Empirical 3D Counterexample Interrogation"}
                  data: {"type":"chunk","text":"Consider "}
                  data: {"type":"chunk","text":"the "}
                  data: {"type":"done"}
```


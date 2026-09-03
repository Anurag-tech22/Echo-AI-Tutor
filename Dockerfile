# ==============================================================================
# Multi-Stage Production Dockerfile for ECHO (Evaluative Cognitive Heuristic Oracle)
# Conforms to Google Cloud / Kubernetes security standards (Non-root, minimal layer)
# ==============================================================================

# Stage 1: Build environment
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies required for native compilation
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

# Compile frontend static bundle and backend production bundle
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine AS runner

WORKDIR /app

# Install curl for container healthcheck
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=3000

# Security: Run as non-root user
USER node

# Copy built application assets and startup runner from builder
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/start.cjs ./start.cjs

EXPOSE 3000

# Health check probe for container orchestrators (Kubernetes / ECS / Cloud Run)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

CMD ["node", "start.cjs"]

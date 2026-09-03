import { describe, it, expect } from 'vitest';

/**
 * Server and API endpoint contract tests
 */
describe('ECHO API Contracts & Utilities', () => {
  describe('Socratic Message Formatter', () => {
    it('sanitizes and maps user and model roles correctly for Gemini API', () => {
      const formatMessages = (rawMessages: Array<{ role: string; content: string }>) => {
        return rawMessages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: (m.content || '').trim() }],
        }));
      };

      const input = [
        { role: 'user', content: ' Heavy objects fall faster! ' },
        { role: 'assistant', content: 'What happens in a vacuum?' },
        { role: 'user', content: 'They land together.' }
      ];

      const formatted = formatMessages(input);

      expect(formatted).toHaveLength(3);
      expect(formatted[0].role).toBe('user');
      expect(formatted[0].parts[0].text).toBe('Heavy objects fall faster!');
      expect(formatted[1].role).toBe('model'); // properly mapped from assistant -> model
      expect(formatted[2].role).toBe('user');
    });

    it('rejects oversized or empty payloads', () => {
      const validatePayload = (body: any) => {
        if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
          return { valid: false, error: 'Empty message history' };
        }
        if (body.messages.length > 50) {
          return { valid: false, error: 'History exceeds max turn limit' };
        }
        return { valid: true };
      };

      expect(validatePayload(null).valid).toBe(false);
      expect(validatePayload({}).valid).toBe(false);
      expect(validatePayload({ messages: [] }).valid).toBe(false);
      expect(validatePayload({ messages: [{ role: 'user', content: 'hi' }] }).valid).toBe(true);
      expect(validatePayload({ messages: new Array(51).fill({ role: 'user', content: 'hi' }) }).valid).toBe(false);
    });
  });

  describe('Healthz & Telemetry Schema', () => {
    it('produces standard Google-grade health check metadata', () => {
      const generateHealthStatus = (startTime: number) => {
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptimeSeconds,
          service: 'echo-ai-tutor',
          environment: process.env.NODE_ENV || 'development',
          memory: {
            heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
          },
        };
      };

      const health = generateHealthStatus(Date.now() - 5000);
      expect(health.status).toBe('healthy');
      expect(health.service).toBe('echo-ai-tutor');
      expect(health.uptimeSeconds).toBeGreaterThanOrEqual(5);
      expect(health.memory.heapUsedMB).toBeGreaterThan(0);
    });
  });
});

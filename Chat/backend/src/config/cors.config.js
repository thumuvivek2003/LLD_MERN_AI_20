import { env } from './env.config.js';

/**
 * Build CORS options used by both Express and Socket.IO.
 */
export function buildCorsOptions() {
  return {
    origin: env.clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

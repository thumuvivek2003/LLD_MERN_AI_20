import express from 'express';
import cors from 'cors';
import { env } from './config/env.config.js';
import { router } from './routes/index.js';
import { notFoundHandler, errorHandler } from './core/middleware/error.middleware.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

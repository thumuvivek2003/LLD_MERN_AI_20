import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes/index.js';
import { notFoundHandler, globalErrorHandler } from './common/middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}

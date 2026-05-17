import express from 'express';
import cors from 'cors';
import { registerAuthRoutes } from './modules/auth/auth.routes.js';
import { registerRateLimiterRoutes } from './modules/rateLimiter/routes/rateLimiter.routes.js';
import { registerAdminRoutes } from './modules/rateLimiter/routes/admin.routes.js';
import { errorHandler, notFoundHandler } from './shared/middleware/errorHandler.middleware.js';
import { requestLogger } from './shared/middleware/requestLogger.middleware.js';

export function createApp() {
  const app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

export function registerMiddlewares(app) {
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);
}

export function registerRoutes(app) {
  app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
  app.use('/api/auth', registerAuthRoutes());
  app.use('/api/v1', registerRateLimiterRoutes());
  app.use('/api/admin', registerAdminRoutes());
}

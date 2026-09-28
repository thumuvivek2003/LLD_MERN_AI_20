import express from 'express';
import cors from 'cors';
import { env } from './config/env.config.js';
import { router } from './routes/index.js';
import { identityMiddleware } from './core/middleware/identity.middleware.js';
import { requestLog } from './core/middleware/request-log.middleware.js';
import { notFoundHandler, errorHandler } from './core/middleware/error.middleware.js';

export function createApp(container) {
  const app = express();

  app.use(cors({ origin: env.clientOrigin, credentials: true, exposedHeaders: ['Content-Disposition'] }));
  app.use(express.json({ limit: '8mb' }));
  app.use(requestLog);

  // Controllers reach their dependencies through the request, so no controller
  // imports the container and the module graph stays acyclic.
  app.use((req, _res, next) => {
    req.container = container;
    next();
  });

  app.get('/health', (_req, res) => res.json({ success: true, data: { ok: true } }));

  app.use('/api', identityMiddleware(container.userRepository), router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

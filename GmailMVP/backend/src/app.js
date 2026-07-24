import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import userRoutes from './modules/user/user.routes.js';
import mailRoutes from './modules/mail/mail.routes.js';
import threadRoutes from './modules/thread/thread.routes.js';
import searchRoutes from './modules/search/search.routes.js';

import { notFound } from './shared/middleware/not-found.middleware.js';
import { errorHandler } from './shared/middleware/error.middleware.js';

/**
 * Build & configure the Express application (no listening here).
 * @param {{clientOrigin:string}} options
 * @returns {import('express').Express}
 */
export function createExpressApp({ clientOrigin } = {}) {
  const app = express();

  app.use(cors({ origin: clientOrigin || true, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok', service: 'gmail-mvp-backend' } });
  });

  // Feature routes
  app.use('/api/users', userRoutes);
  app.use('/api/mails', mailRoutes);
  app.use('/api/threads', threadRoutes);
  app.use('/api/search', searchRoutes);

  // 404 + centralized error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createExpressApp;

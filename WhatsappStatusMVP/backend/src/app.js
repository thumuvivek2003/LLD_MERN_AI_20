// app.js — createExpressApp()
// Builds the Express application: middleware, module routers, error handling.
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { registerUserRoutes } from './modules/user/user.routes.js';
import { registerFriendshipRoutes } from './modules/friendship/friendship.routes.js';
import { registerStatusRoutes } from './modules/status/status.routes.js';
import { handleError, notFoundRoute } from './core/middleware/error.middleware.js';

export function createExpressApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'whatsapp-status', time: new Date().toISOString() }));

  // Module routers (dependency direction: routes → controller → service → repo)
  app.use('/api/users', registerUserRoutes());
  app.use('/api/friends', registerFriendshipRoutes());
  app.use('/api/status', registerStatusRoutes());

  app.use(notFoundRoute);
  app.use(handleError);

  return app;
}

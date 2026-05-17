import express from 'express';
import cors from 'cors';
import { loadEnv } from './config/env.config.js';
import { globalErrorHandler, notFoundHandler } from './shared/middleware/error.middleware.js';
import { successResponse } from './shared/utils/response.util.js';

import authRoutes from './modules/auth/routes/auth.routes.js';
import userRoutes from './modules/user/routes/user.routes.js';
import walletRoutes from './modules/wallet/routes/wallet.routes.js';
import auctionRoutes from './modules/auction/routes/auction.routes.js';

import { registerLiveBidSubscriber } from './modules/auction/subscribers/liveBid.subscriber.js';
import { registerAuctionCloseSubscriber } from './modules/auction/subscribers/auctionClose.subscriber.js';
import { registerAuditLogSubscriber } from './modules/auction/subscribers/auditLog.subscriber.js';

export function bootstrapApp() {
  const { corsOrigin } = loadEnv();
  const app = express();

  app.use(cors({ origin: corsOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => successResponse(res, { status: 'ok' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/wallet', walletRoutes);
  app.use('/api/auctions', auctionRoutes);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  // Subscribers attach once at bootstrap.
  registerLiveBidSubscriber();
  registerAuctionCloseSubscriber();
  registerAuditLogSubscriber();

  return app;
}

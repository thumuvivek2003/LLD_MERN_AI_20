import http from 'http';
import { loadEnv } from './config/env.config.js';
import { connectDB } from './config/db.config.js';
import { initializeSocket } from './config/socket.config.js';
import { bootstrapApp } from './app.js';
import { startAuctionScheduler } from './jobs/auction.job.js';
import { seedIfEmpty } from './jobs/seed.js';
import { logError, logInfo } from './shared/utils/logger.util.js';

export async function startServer() {
  const env = loadEnv();

  await connectDB();
  await seedIfEmpty();

  const app = bootstrapApp();
  const httpServer = http.createServer(app);
  initializeSocket(httpServer);
  startAuctionScheduler();

  httpServer.listen(env.port, () => {
    logInfo(`Auction backend listening on :${env.port}`);
  });

  return httpServer;
}

startServer().catch((err) => {
  logError('Fatal startup failure', err);
  process.exit(1);
});

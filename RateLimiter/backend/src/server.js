import { loadEnvConfig } from './config/env.js';
import { connectMongoDB } from './config/database.js';
import { createApp } from './app.js';
import { strategyManagerService } from './modules/rateLimiter/services/strategyManager.service.js';
import { startCleanupService } from './modules/rateLimiter/services/cleanup.service.js';
import { logger } from './modules/rateLimiter/utils/logger.util.js';

export async function connectDatabase() {
  return connectMongoDB();
}

export async function startServer() {
  const env = loadEnvConfig();
  await connectDatabase();
  await strategyManagerService.hydrateFromConfig();
  startCleanupService();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`server.listening on :${env.port}`);
  });
  return { app, server };
}

startServer().catch((err) => {
  logger.error('server.bootstrap.failed', { message: err.message, stack: err.stack });
  process.exit(1);
});

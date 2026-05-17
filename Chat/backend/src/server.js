import http from 'http';
import { env } from './config/env.config.js';
import { connectMongo } from './config/db.config.js';
import { initializeSocket } from './config/socket.config.js';
import { bootstrapApp } from './app.js';
import { seedAdminUser } from './seed.js';
import { logger } from './shared/logger/logger.js';

export async function startServer() {
  const conn = await connectMongo();
  if (conn) {
    await seedAdminUser();
  }

  const app = bootstrapApp();
  const httpServer = http.createServer(app);
  initializeSocket(httpServer);

  httpServer.listen(env.port, () => {
    logger.info(`HTTP + Socket.IO listening on http://localhost:${env.port}`);
    logger.info(`CORS allowed origin: ${env.clientOrigin}`);
    logger.info(`Dev OTP: ${env.devFixedOtp}`);
  });

  const shutdown = () => {
    logger.info('Shutting down...');
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  logger.error('Fatal startup error:', err);
  process.exit(1);
});

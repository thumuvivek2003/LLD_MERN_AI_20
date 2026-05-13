import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.config.js';
import { connectDatabase } from './config/db.config.js';
import { initSocket } from './config/socket.config.js';
import { logger } from './core/utils/logger.util.js';
import { registerNotificationSubscriber } from './core/event-bus/subscribers/notification.subscriber.js';
import { registerSocketSubscriber } from './core/event-bus/subscribers/socket.subscriber.js';
import { registerOtpSubscriber } from './core/event-bus/subscribers/otp.subscriber.js';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);
  initSocket(httpServer);

  registerNotificationSubscriber();
  registerSocketSubscriber();
  registerOtpSubscriber();

  httpServer.listen(env.port, () => {
    logger.info(`Ride System API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed', err);
  process.exit(1);
});

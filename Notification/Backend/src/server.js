import { loadAppConfig } from './config/app.config.js';
import { connectDatabase } from './config/db.config.js';
import { createExpressApp } from './app.js';
import { logger } from './shared/logger/logger.js';

import { startNotificationWorker } from './modules/notification/workers/notification.worker.js';
import { startRetryWorker } from './modules/notification/workers/retry.worker.js';
import { onNotificationEvent } from './modules/notification/observers/notificationEvent.listener.js';
import { handleEmailNotification } from './modules/notification/observers/email.listener.js';
import { handleSMSNotification } from './modules/notification/observers/sms.listener.js';
import { handlePushNotification } from './modules/notification/observers/push.listener.js';

export async function bootstrapServer() {
  const config = loadAppConfig();
  await connectDatabase();

  // Wire observers BEFORE workers so we don't miss early events
  onNotificationEvent();
  handleEmailNotification();
  handleSMSNotification();
  handlePushNotification();

  // Workers depend on the queue singleton + mongo connection
  startNotificationWorker();
  startRetryWorker();

  const app = createExpressApp();
  const server = app.listen(config.port, () => {
    logger.info('server.listening', { port: config.port });
  });

  return { app, server };
}

bootstrapServer().catch((err) => {
  logger.error('server.bootstrap.failed', { err: err.message, stack: err.stack });
  process.exit(1);
});

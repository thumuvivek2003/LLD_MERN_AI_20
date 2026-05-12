import { createExpressApp } from './app.js';
import { connectDatabase } from './config/db.config.js';
import { env } from './config/env.config.js';
import { createLogger } from './config/logger.config.js';

const logger = createLogger();

export const startServer = async () => {
  await connectDatabase();
  const app = createExpressApp();
  app.listen(env.port, () => logger.info(`Server running on port ${env.port}`));
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

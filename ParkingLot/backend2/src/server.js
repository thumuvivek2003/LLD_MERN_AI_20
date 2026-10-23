import { buildApp } from './app.js';
import { connectDB } from './config/db.config.js';
import { appConfig } from './config/app.config.js';
import { Logger } from './utils/Logger.js';

const start = async () => {
  await connectDB();
  Logger.info('MongoDB connected');
  const app = buildApp();
  app.listen(appConfig.port, () => Logger.info(`Server listening on :${appConfig.port}`));
};

start().catch((err) => {
  Logger.error('Startup failed', err);
  process.exit(1);
});

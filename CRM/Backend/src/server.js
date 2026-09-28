import { createApp } from './app.js';
import { env } from './config/env.config.js';
import { connectDatabase } from './config/db.config.js';
import { buildContainer } from './container.js';
import { logger } from './core/utils/logger.util.js';

async function bootstrap() {
  await connectDatabase();

  const container = buildContainer();

  // Warm the two in-memory layers before serving traffic.
  await container.metadataCache.refresh();
  await container.indexManager.loadAll();
  container.metricsService.start();

  const app = createApp(container);

  const server = app.listen(env.port, () => {
    logger.info(`MetaForce API listening on http://localhost:${env.port} (${env.nodeEnv})`, null, 'server');
  });

  const shutdown = (signal) => {
    logger.warn(`${signal} received — shutting down`, null, 'server');
    container.jobRegistry.stopAll();
    container.metricsService.stop();
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.critical(`Bootstrap failed: ${err.message}`, err.stack, 'server');
  process.exit(1);
});

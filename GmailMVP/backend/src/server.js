import http from 'node:http';

import { loadEnv } from './config/env.config.js';
import { connectMongoDB } from './config/db.config.js';
import { initializeSocket } from './config/socket.config.js';
import { seedDatabase } from './config/seed.config.js';
import { createExpressApp } from './app.js';

import { buildIndex } from './modules/search/search.service.js';
import { registerThreadSubscriber } from './shared/observer/subscribers/thread.subscriber.js';
import { registerIndexSubscriber } from './shared/observer/subscribers/index.subscriber.js';
import { registerSocketSubscriber } from './shared/observer/subscribers/socket.subscriber.js';

/**
 * Register all Observer subscribers exactly once at startup.
 */
function registerSubscribers() {
  registerThreadSubscriber();
  registerIndexSubscriber();
  registerSocketSubscriber();
}

/**
 * Application entry point.
 */
async function startServer() {
  const env = loadEnv();

  // 1) Wire the Observer subscribers before anything can publish events.
  registerSubscribers();

  // 2) Build the Express app + HTTP server + Socket.IO.
  const app = createExpressApp({ clientOrigin: env.clientOrigin });
  const httpServer = http.createServer(app);
  initializeSocket(httpServer, env.clientOrigin);

  // 3) Connect to MongoDB. If unavailable, log clearly but keep the process
  //    alive (no crash-loop). REST routes touching the DB will simply error.
  try {
    await connectMongoDB(env.mongoUri);
    await seedDatabase();
    await buildIndex();
  } catch (err) {
    console.error('\n[startup] Could not connect to MongoDB at', env.mongoUri);
    console.error('[startup] Reason:', err.message);
    console.error('[startup] The server will still listen, but DB-backed routes will fail.');
    console.error('[startup] Start MongoDB (e.g. `mongod`) and restart for full functionality.\n');
  }

  // 4) Listen.
  httpServer.listen(env.port, () => {
    console.log(`\n[server] Gmail MVP backend listening on http://localhost:${env.port}`);
    console.log(`[server] REST base:   http://localhost:${env.port}/api`);
    console.log(`[server] Socket.IO:   http://localhost:${env.port}`);
    console.log(`[server] CORS origin: ${env.clientOrigin}\n`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[server] ${signal} received — shutting down`);
    httpServer.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('[server] fatal startup error:', err);
  process.exit(1);
});

export { startServer };

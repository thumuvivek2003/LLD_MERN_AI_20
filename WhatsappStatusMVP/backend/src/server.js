// server.js — startServer()
// Composition root: connect Mongo (singleton), build the app, attach Socket.IO
// (singleton), register socket events, and start listening.
import http from 'http';
import { env } from './config/env.js';
import { connectMongo } from './config/database.js';
import { createSocketServer } from './config/socket.js';
import { createExpressApp } from './app.js';
import { registerEvents } from './core/socket/socket.gateway.js';

async function startServer() {
  await connectMongo();

  const app = createExpressApp();
  const httpServer = http.createServer(app);

  const io = createSocketServer(httpServer);
  registerEvents(io);

  httpServer.listen(env.port, () => {
    console.log(`[server] WhatsApp Status API listening on http://localhost:${env.port}`);
    console.log(`[server] CORS origin → ${env.clientOrigin}`);
  });
}

startServer().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});

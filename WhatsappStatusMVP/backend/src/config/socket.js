// config/socket.js — createSocketServer() [Singleton]
// Wraps a single Socket.IO server instance and exposes it app-wide.
import { Server } from 'socket.io';
import { env } from './env.js';

let io = null;

export function createSocketServer(httpServer) {
  if (io) return io;

  io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, methods: ['GET', 'POST'] },
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket server not initialised. Call createSocketServer() first.');
  return io;
}

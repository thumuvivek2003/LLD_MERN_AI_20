import { Server } from 'socket.io';
import { env } from './env.config.js';
import { socketManager } from '../core/socket/socket.manager.js';
import { registerSocketHandlers } from '../core/socket/socket.handlers.js';

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });
  socketManager.setIo(io);
  registerSocketHandlers(io);
  return io;
}

import { Server } from 'socket.io';
import { loadEnv } from './env.config.js';
import { socketManager } from '../shared/socket/socketManager.singleton.js';
import { registerAuctionSocket } from '../modules/auction/sockets/auction.socket.js';
import { logInfo } from '../shared/utils/logger.util.js';

export function initializeSocket(httpServer) {
  const { corsOrigin } = loadEnv();
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
  });

  socketManager.setIO(io);

  io.on('connection', (socket) => {
    logInfo(`socket connected: ${socket.id}`);
    registerAuctionSocket(socket);
    socket.on('disconnect', () => logInfo(`socket disconnected: ${socket.id}`));
  });

  return io;
}

import { Server as SocketIOServer } from 'socket.io';
import { buildCorsOptions } from './cors.config.js';
import { registerSocketGateway } from '../modules/socket/socket.gateway.js';
import { logger } from '../shared/logger/logger.js';

/**
 * Attach Socket.IO to an HTTP server and wire up the gateway.
 */
export function initializeSocket(httpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: buildCorsOptions(),
  });
  registerSocketGateway(io);
  logger.info('Socket.IO initialized');
  return io;
}

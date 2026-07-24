import { Server } from 'socket.io';
import { socketManager } from '../shared/singleton/socket-manager.singleton.js';
import { SOCKET_EVENTS } from '../shared/constants/socket-events.constant.js';

/**
 * Initialize Socket.IO on the given HTTP server and wire the singleton.
 * Clients join a room named by their userId via `user:join`.
 *
 * @param {import('http').Server} httpServer
 * @param {string} clientOrigin CORS origin allowed to connect
 * @returns {import('socket.io').Server}
 */
export function initializeSocket(httpServer, clientOrigin) {
  const io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST'],
    },
  });

  socketManager.setIO(io);

  io.on('connection', (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.USER_JOIN, (payload) => {
      const userId = payload?.userId;
      if (userId) {
        socket.join(String(userId));
        console.log(`[socket] ${socket.id} joined room ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });

  return io;
}

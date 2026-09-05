// core/socket/socket.gateway.js — registerEvents()
// Wires connection lifecycle. Each client identifies itself and joins its own
// room; from then on the publisher can target it precisely (subscriber side).
import { SOCKET_EVENTS, userRoom } from '../constants/socket.constants.js';

export function registerEvents(io) {
  io.on('connection', (socket) => {
    socket.on(SOCKET_EVENTS.IDENTIFY, (userId) => {
      if (!userId) return;
      socket.data.userId = String(userId);
      socket.join(userRoom(String(userId)));
    });

    socket.on('disconnect', () => {
      // rooms are cleaned up automatically by socket.io
    });
  });

  console.log('[socket] gateway ready');
}

import { io } from 'socket.io-client';

export const SOCKET_EVENTS = {
  USER_JOIN: 'user:join',
  MAIL_RECEIVED: 'mail:received',
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let socket = null;

/**
 * Singleton socket accessor. Creates the connection lazily and reuses it.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1500,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function joinUserRoom(userId) {
  if (!userId) return;
  getSocket().emit(SOCKET_EVENTS.USER_JOIN, { userId });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// core/socket/socket.js — createSocket() [Singleton]
// A single Socket.IO client. Connects lazily and re-identifies on (re)connect.
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from './socket.constants.js';

let socket = null;
let identifiedUserId = null;

export function createSocket() {
  if (socket) return socket;
  // same-origin; Vite proxies /socket.io → backend
  socket = io('/', { autoConnect: true, transports: ['websocket', 'polling'] });
  socket.on('connect', () => {
    if (identifiedUserId) socket.emit(SOCKET_EVENTS.IDENTIFY, identifiedUserId);
  });
  return socket;
}

// Announce which user this client is, so the server can target its room.
export function identify(userId) {
  identifiedUserId = userId;
  const s = createSocket();
  if (s.connected) s.emit(SOCKET_EVENTS.IDENTIFY, userId);
}

export function getSocket() {
  return createSocket();
}

import { io } from 'socket.io-client';
import { loadEnvironmentConfig } from './env.js';

let socket = null;

export function initializeSocket() {
  if (socket) return socket;
  const { socketUrl } = loadEnvironmentConfig();
  socket = io(socketUrl, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
  });
  socket.on('connect', () => console.log('[socket] connected', socket.id));
  socket.on('disconnect', () => console.log('[socket] disconnected'));
  return socket;
}

export function getSocket() {
  if (!socket) return initializeSocket();
  return socket;
}

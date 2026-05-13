import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let instance = null;

export function getSocket() {
  if (!instance) {
    instance = io(URL, { autoConnect: false, transports: ['websocket', 'polling'] });
  }
  return instance;
}

export function connectSocket(user) {
  const s = getSocket();
  if (!s.connected) s.connect();
  if (user?.id) s.emit('join', { userId: user.id, role: user.role });
  return s;
}

export function disconnectSocket() {
  if (instance && instance.connected) instance.disconnect();
}

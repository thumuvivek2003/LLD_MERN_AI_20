import { getSocket, connectSocket, disconnectSocket } from '../../app/socket.js';

export const socketService = {
  connect: (user) => connectSocket(user),
  disconnect: () => disconnectSocket(),
  on: (event, fn) => {
    const s = getSocket();
    s.on(event, fn);
    return () => s.off(event, fn);
  },
  emit: (event, payload) => getSocket().emit(event, payload),
};

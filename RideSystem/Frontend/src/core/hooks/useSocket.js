import { useEffect } from 'react';
import { useSocketCtx } from '../context/SocketContext.jsx';

export function useSocket() {
  return useSocketCtx()?.socket;
}

export function useSocketEvent(event, handler) {
  const socket = useSocket();
  useEffect(() => {
    if (!socket || !event) return undefined;
    return socket.on(event, handler);
  }, [socket, event, handler]);
}

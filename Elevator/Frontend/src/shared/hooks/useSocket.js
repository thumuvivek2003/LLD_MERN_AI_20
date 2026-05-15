import { useEffect } from 'react';
import { getSocket } from '../../config/socket.js';

export function useSocket(event, handler) {
  useEffect(() => {
    if (!event || !handler) return;
    const socket = getSocket();
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}

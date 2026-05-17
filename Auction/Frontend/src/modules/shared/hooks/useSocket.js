import { useEffect } from 'react';
import { socketClient } from '../services/socketClient.js';

export function useSocket() {
  return {
    connect: () => socketClient.connect(),
    emit: (event, payload) => {
      const s = socketClient.connect();
      s.emit(event, payload);
    },
    subscribe: (event, handler) => socketClient.on(event, handler),
  };
}

export function useSocketEvent(event, handler, deps = []) {
  useEffect(() => {
    const unsubscribe = socketClient.on(event, handler);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

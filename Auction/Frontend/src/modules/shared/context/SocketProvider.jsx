import { createContext, useContext, useEffect, useMemo } from 'react';
import { socketClient } from '../services/socketClient.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  useEffect(() => {
    socketClient.connect();
    return () => {
      // keep connection alive across route changes; explicit disconnect on logout
    };
  }, []);

  const value = useMemo(() => ({ client: socketClient }), []);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocketContext must be used inside SocketProvider');
  }
  return ctx;
}

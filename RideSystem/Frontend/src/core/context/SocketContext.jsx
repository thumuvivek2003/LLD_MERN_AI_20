import { createContext, useContext, useEffect } from 'react';
import { useAuthCtx } from './AuthContext.jsx';
import { socketService } from '../services/socket.service.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuthCtx();

  useEffect(() => {
    if (user?.id) {
      socketService.connect(user);
    } else {
      socketService.disconnect();
    }
    return () => socketService.disconnect();
  }, [user?.id, user?.role]);

  return <SocketContext.Provider value={{ socket: socketService }}>{children}</SocketContext.Provider>;
}

export const useSocketCtx = () => useContext(SocketContext);

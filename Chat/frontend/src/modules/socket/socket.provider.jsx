import { useEffect, useRef, useState } from 'react';
import { SocketContext } from './socket.context.js';
import { connectSocket, disconnectSocket } from './socket.client.js';
import { registerSocketListeners } from './socket.listeners.js';
import { useAuthStore } from '../auth/store/auth.store.js';

/**
 * Mounts the singleton socket client whenever a JWT exists, attaches every
 * server -> client listener via `registerSocketListeners`, and exposes the
 * socket instance to children through `SocketContext`.
 */
export function SocketProvider({ children }) {
  const token = useAuthStore((s) => s.token);
  const [socket, setSocket] = useState(null);
  const detachRef = useRef(null);

  useEffect(() => {
    if (!token) {
      // Logged out — tear down any existing socket.
      if (detachRef.current) detachRef.current();
      detachRef.current = null;
      disconnectSocket();
      setSocket(null);
      return undefined;
    }

    const s = connectSocket(token);
    setSocket(s);
    detachRef.current = registerSocketListeners(s);

    return () => {
      if (detachRef.current) detachRef.current();
      detachRef.current = null;
      disconnectSocket();
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

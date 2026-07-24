import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getSocket,
  joinUserRoom,
  SOCKET_EVENTS,
} from './socket.manager.js';
import { useUser } from '../context/UserContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const SocketContext = createContext(null);

/**
 * Connects the socket for the current user, joins their room, and surfaces
 * incoming `mail:received` events as toasts plus a subscribable stream so
 * pages (e.g. Inbox) can prepend new mail in real time.
 */
export function SocketProvider({ children }) {
  const { currentUser } = useUser();
  const { pushToast } = useToast();
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef(new Set());

  // Allow pages to subscribe to new mail events.
  const subscribe = (cb) => {
    listenersRef.current.add(cb);
    return () => listenersRef.current.delete(cb);
  };

  useEffect(() => {
    if (!currentUser?.id) return undefined;

    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      joinUserRoom(currentUser.id);
    };
    const onDisconnect = () => setConnected(false);

    const onMailReceived = (mailDto) => {
      const senderName = mailDto?.sender?.name || 'Someone';
      pushToast({
        variant: 'mail',
        title: 'New Email',
        from: senderName,
        subject: mailDto?.subject || '(no subject)',
        snippet: mailDto?.snippet || '',
        avatarColor: mailDto?.sender?.avatarColor || '#6366f1',
        senderName,
      });
      listenersRef.current.forEach((cb) => {
        try {
          cb(mailDto);
        } catch {
          /* ignore listener errors */
        }
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(SOCKET_EVENTS.MAIL_RECEIVED, onMailReceived);

    // If already connected, join immediately.
    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(SOCKET_EVENTS.MAIL_RECEIVED, onMailReceived);
    };
  }, [currentUser?.id, pushToast]);

  return (
    <SocketContext.Provider value={{ connected, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
}

export default SocketContext;

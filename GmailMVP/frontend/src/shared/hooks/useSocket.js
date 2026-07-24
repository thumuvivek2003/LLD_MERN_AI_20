import { useEffect } from 'react';
import { useSocketContext } from '../socket/SocketProvider.jsx';

/**
 * Subscribe to real-time `mail:received` events.
 * @param {(mailDto:object)=>void} onMail
 */
export function useSocket(onMail) {
  const { subscribe, connected } = useSocketContext();

  useEffect(() => {
    if (typeof onMail !== 'function') return undefined;
    const unsub = subscribe(onMail);
    return unsub;
  }, [subscribe, onMail]);

  return { connected };
}

export default useSocket;

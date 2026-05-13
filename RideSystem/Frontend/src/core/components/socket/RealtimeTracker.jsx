import { useEffect, useState } from 'react';
import { useSocketEvent } from '../../hooks/useSocket.js';

export default function RealtimeTracker({ event = 'ride:driver:location', children }) {
  const [pos, setPos] = useState(null);
  useSocketEvent(event, (p) => setPos(p));
  useEffect(() => {}, []);
  return typeof children === 'function' ? children(pos) : null;
}

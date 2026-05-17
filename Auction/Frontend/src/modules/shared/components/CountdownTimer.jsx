import { useEffect, useState } from 'react';
import { calculateRemainingTime } from '../utils/timer.util.js';

// Renders HH:MM:SS until endTime. Ticks every 1s; cleans interval on unmount.
export default function CountdownTimer({ endTime, onExpire, className = '' }) {
  const [remaining, setRemaining] = useState(() => calculateRemainingTime(endTime));

  useEffect(() => {
    setRemaining(calculateRemainingTime(endTime));
    const id = setInterval(() => {
      const next = calculateRemainingTime(endTime);
      setRemaining(next);
      if (next.expired) {
        clearInterval(id);
        if (typeof onExpire === 'function') onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endTime, onExpire]);

  if (remaining.expired) {
    return <span className={`font-mono text-slate-400 ${className}`}>00:00:00</span>;
  }

  return (
    <span className={`font-mono ${className}`}>
      {remaining.hh}:{remaining.mm}:{remaining.ss}
    </span>
  );
}

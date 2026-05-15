import { useEffect, useRef } from 'react';

export default function ElevatorMovementAnimator({ currentFloor, onArrive }) {
  const last = useRef(currentFloor);
  useEffect(() => {
    if (last.current !== currentFloor) {
      const t = setTimeout(() => onArrive && onArrive(currentFloor), 300);
      last.current = currentFloor;
      return () => clearTimeout(t);
    }
  }, [currentFloor, onArrive]);
  return null;
}

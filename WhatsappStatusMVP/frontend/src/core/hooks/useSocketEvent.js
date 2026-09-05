// core/hooks/useSocketEvent.js — subscribe to a socket event for a component's
// lifetime. Keeps the handler ref fresh without re-subscribing each render.
import { useEffect, useRef } from 'react';
import { subscribe } from '../socket/socket.subscriber.js';

export function useSocketEvent(eventName, handler) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => subscribe(eventName, (...args) => ref.current?.(...args)), [eventName]);
}

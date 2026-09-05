// core/socket/socket.subscriber.js — subscribe() (Observer/Pub-Sub, client side)
// Thin wrapper so hooks/components subscribe to events without importing the
// raw socket. Returns an unsubscribe function for clean effect teardown.
import { getSocket } from './socket.js';

export function subscribe(eventName, handler) {
  const s = getSocket();
  s.on(eventName, handler);
  return () => s.off(eventName, handler);
}

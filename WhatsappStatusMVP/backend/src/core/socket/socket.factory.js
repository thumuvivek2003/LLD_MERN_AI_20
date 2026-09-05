// core/socket/socket.factory.js — createEvent() [Factory]
// Builds a normalised event envelope { name, payload } so publishers never
// hand-craft ad-hoc objects. Single place to evolve the wire format.
import { SOCKET_EVENTS } from '../constants/socket.constants.js';

export function createEvent(name, payload = {}) {
  if (!Object.values(SOCKET_EVENTS).includes(name)) {
    throw new Error(`Unknown socket event: ${name}`);
  }
  return { name, payload, at: new Date().toISOString() };
}

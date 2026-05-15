import { getSocket } from '../../../config/socket.js';

export const ELEVATOR_EVENTS = {
  TICK: 'simulation:tick',
  UPDATE: 'elevator:update',
  EVENT_LOG: 'event:log',
  REQUEST_CREATED: 'request:created',
  REQUEST_COMPLETED: 'request:completed',
};

export function emitSocket(event, payload) {
  const s = getSocket();
  s.emit(event, payload);
}

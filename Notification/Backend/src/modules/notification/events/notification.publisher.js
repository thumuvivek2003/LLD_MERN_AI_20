import { EventEmitter } from 'node:events';

/**
 * Singleton EventEmitter — the observer/event bus for the notification
 * domain. Publishers call publish(event, payload); subscribers call
 * subscribe(event, listener).
 */
const bus = new EventEmitter();
bus.setMaxListeners(50);

export const notificationPublisher = {
  publish(event, payload) {
    bus.emit(event, payload);
  },
  subscribe(event, listener) {
    bus.on(event, listener);
  },
  unsubscribe(event, listener) {
    bus.off(event, listener);
  },
  raw: bus,
};

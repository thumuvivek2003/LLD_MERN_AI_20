import { logger } from '../shared/logger/logger.js';

/**
 * In-memory pub/sub bus (Observer pattern, Singleton).
 * Each event maps to a Set of async subscribers.
 *
 * publish() fires-and-forgets — subscriber failures are logged but
 * never propagate back to the caller (decoupling).
 */
class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._subscribers = new Map();
  }

  subscribe(eventName, handler) {
    if (!this._subscribers.has(eventName)) {
      this._subscribers.set(eventName, new Set());
    }
    this._subscribers.get(eventName).add(handler);
    return () => this.unsubscribe(eventName, handler);
  }

  unsubscribe(eventName, handler) {
    const set = this._subscribers.get(eventName);
    if (set) set.delete(handler);
  }

  publish(eventName, payload) {
    const set = this._subscribers.get(eventName);
    if (!set || set.size === 0) return;
    for (const handler of set) {
      // Async fire-and-forget, never block the publisher.
      Promise.resolve()
        .then(() => handler(payload))
        .catch((err) => {
          logger.error(`EventBus subscriber error on ${eventName}:`, err?.message || err);
        });
    }
  }
}

const eventBus = new EventBus();

export function publish(eventName, payload) {
  return eventBus.publish(eventName, payload);
}

export function subscribe(eventName, handler) {
  return eventBus.subscribe(eventName, handler);
}

export default eventBus;

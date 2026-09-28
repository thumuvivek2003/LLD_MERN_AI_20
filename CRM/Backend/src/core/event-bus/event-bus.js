import { EventEmitter } from 'node:events';
import { IEventBus } from '../interfaces/event-bus.interface.js';
import { eventId as newEventId } from '../utils/id.util.js';
import { logger } from '../utils/logger.util.js';

/**
 * In-process Observer bus (the MVP stand-in for Kafka, per chat.md).
 *
 * Producers (services) never know their consumers: a record service publishes
 * `record.created` and the index, audit, cache and monitor subscribers react.
 * Handlers run detached so a slow/failing subscriber can never break a write.
 */
export class InProcessEventBus extends IEventBus {
  constructor() {
    super();
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(200);
    this.wildcard = [];
    this.published = 0;
    this.failed = 0;
    this.inFlight = 0;
    this.timestamps = []; // rolling window for throughput
  }

  publish(type, payload = {}) {
    const envelope = {
      eventId: newEventId(),
      type,
      at: new Date(),
      payload,
    };
    this.published += 1;
    this.#recordTimestamp(envelope.at);

    const listeners = [...this.emitter.listeners(type), ...this.wildcard];
    for (const handler of listeners) {
      this.inFlight += 1;
      queueMicrotask(() => {
        Promise.resolve()
          .then(() => handler(envelope))
          .catch((err) => {
            this.failed += 1;
            logger.error(`Event handler failed for ${type}: ${err.message}`, null, 'event-bus');
          })
          .finally(() => {
            this.inFlight -= 1;
          });
      });
    }
    return envelope;
  }

  subscribe(type, handler) {
    this.emitter.on(type, handler);
    return () => this.emitter.off(type, handler);
  }

  subscribeAll(handler) {
    this.wildcard.push(handler);
    return () => {
      this.wildcard = this.wildcard.filter((h) => h !== handler);
    };
  }

  /** Await the currently queued handlers — used by the seed script. */
  async drain() {
    for (let i = 0; i < 200 && this.inFlight > 0; i += 1) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  #recordTimestamp(at) {
    this.timestamps.push(at.getTime());
    if (this.timestamps.length > 5000) this.timestamps.splice(0, this.timestamps.length - 5000);
  }

  throughputPerMin() {
    const cutoff = Date.now() - 60_000;
    return this.timestamps.filter((t) => t >= cutoff).length;
  }

  stats() {
    return {
      published: this.published,
      failed: this.failed,
      queued: this.inFlight,
      throughputPerMin: this.throughputPerMin(),
      subscribedTypes: this.emitter.eventNames().length,
    };
  }
}

/** The application uses one bus instance, wired in the container. */
export const eventBus = new InProcessEventBus();

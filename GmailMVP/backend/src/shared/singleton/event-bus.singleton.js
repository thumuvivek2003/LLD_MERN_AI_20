import { EventEmitter } from 'node:events';

/**
 * EventBus (Singleton) — a thin wrapper over Node's EventEmitter used as the
 * in-process pub/sub backbone for the Observer pattern.
 *
 * Publishers (e.g. MailService) call `publish(event, payload)`.
 * Subscribers (thread/index/socket) call `subscribe(event, handler)` at startup.
 */
class EventBus {
  constructor() {
    this.emitter = new EventEmitter();
    // Sending one mail can fan out to several subscribers; lift the default cap.
    this.emitter.setMaxListeners(50);
  }

  /**
   * @param {string} event
   * @param {(payload: any) => void} handler
   * @returns {() => void} unsubscribe function
   */
  subscribe(event, handler) {
    this.emitter.on(event, handler);
    return () => this.emitter.off(event, handler);
  }

  /**
   * @param {string} event
   * @param {*} payload
   */
  publish(event, payload) {
    this.emitter.emit(event, payload);
  }
}

export const eventBus = new EventBus();
export default eventBus;

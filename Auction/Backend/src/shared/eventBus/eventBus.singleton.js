// In-process pub/sub bus. Singleton so producers and subscribers share state.
// Decouples bid/auction services from socket layer + audit logging.

class EventBus {
  constructor() {
    this.listeners = new Map(); // event -> Set<handler>
  }

  subscribe(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  }

  publish(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    // fire-and-forget; subscribers must not throw into producer
    for (const fn of set) {
      Promise.resolve()
        .then(() => fn(payload))
        .catch((err) => console.error(`[eventBus] handler error for ${event}`, err));
    }
  }
}

export const eventBus = new EventBus();

class EventBus {
  constructor() {
    if (EventBus._instance) return EventBus._instance;
    this.subscribers = new Map();
    EventBus._instance = this;
  }

  subscribe(event, observer) {
    if (!this.subscribers.has(event)) this.subscribers.set(event, []);
    this.subscribers.get(event).push(observer);
  }

  publish(event, payload) {
    const list = this.subscribers.get(event) || [];
    for (const observer of list) {
      Promise.resolve(observer.notify?.(payload)).catch((e) =>
        console.error(`[EventBus] ${event} observer failed:`, e.message)
      );
    }
  }
}

export const eventBus = new EventBus();

export const EVENTS = Object.freeze({
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  OTP_GENERATED: 'OTP_GENERATED',
});

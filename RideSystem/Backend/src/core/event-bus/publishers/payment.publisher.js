import { eventBus } from '../eventBus.js';

export const PaymentPublisher = {
  paymentCompleted: (payload) => eventBus.emit('payment.completed', payload),
  paymentFailed: (payload) => eventBus.emit('payment.failed', payload),
};

import { PaymentModel } from './payment.model.js';
import { getPaymentStrategy } from './factories/payment-strategy.factory.js';
import { eventBus, EVENTS } from '../notifications/event-bus.js';

class PaymentService {
  async processPayment({ orderId, userId, amount, method, customer }) {
    const strategy = getPaymentStrategy(method);
    const result = await strategy.pay({ amount });
    const payment = await PaymentModel.create({
      orderId,
      userId,
      amount,
      method,
      status: result.status,
      transactionId: result.transactionId,
    });
    if (result.status === 'SUCCESS') {
      eventBus.publish(EVENTS.PAYMENT_SUCCESS, { order: { id: orderId }, customer, method });
    }
    return payment;
  }
}

export const paymentService = new PaymentService();

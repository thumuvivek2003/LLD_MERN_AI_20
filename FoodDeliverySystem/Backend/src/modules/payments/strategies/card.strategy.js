import { PaymentStrategy } from './payment-strategy.interface.js';
import { PAYMENT_STATUS } from '../../../core/constants/payment.constants.js';

export class CardStrategy extends PaymentStrategy {
  async pay({ amount }) {
    return {
      status: PAYMENT_STATUS.SUCCESS,
      transactionId: `CARD-${Date.now()}`,
      amount,
    };
  }
}

import { PaymentStrategy } from './payment-strategy.interface.js';
import { PAYMENT_STATUS } from '../../../core/constants/payment.constants.js';

export class CodStrategy extends PaymentStrategy {
  async pay({ amount }) {
    return {
      status: PAYMENT_STATUS.PENDING,
      transactionId: `COD-${Date.now()}`,
      amount,
    };
  }
}

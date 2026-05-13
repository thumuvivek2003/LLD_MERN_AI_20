import { PaymentStrategy } from './payment.strategy.js';
import { PAYMENT_METHOD } from '../../../config/constants.js';

export class CashPaymentStrategy extends PaymentStrategy {
  constructor() { super(PAYMENT_METHOD.CASH); }
  async process() {
    return { ok: true, ref: `CASH-${Date.now()}` };
  }
}

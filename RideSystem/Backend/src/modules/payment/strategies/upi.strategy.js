import { PaymentStrategy } from './payment.strategy.js';
import { PAYMENT_METHOD } from '../../../config/constants.js';

export class UpiPaymentStrategy extends PaymentStrategy {
  constructor() { super(PAYMENT_METHOD.UPI); }
  async process() {
    return { ok: true, ref: `UPI-${Date.now()}` };
  }
}

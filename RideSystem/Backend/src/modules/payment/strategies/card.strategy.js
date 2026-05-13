import { PaymentStrategy } from './payment.strategy.js';
import { PAYMENT_METHOD } from '../../../config/constants.js';

export class CardPaymentStrategy extends PaymentStrategy {
  constructor() { super(PAYMENT_METHOD.CARD); }
  async process() {
    return { ok: true, ref: `CARD-${Date.now()}` };
  }
}

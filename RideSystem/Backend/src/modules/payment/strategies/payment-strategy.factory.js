import { PAYMENT_METHOD } from '../../../config/constants.js';
import { CashPaymentStrategy } from './cash.strategy.js';
import { UpiPaymentStrategy } from './upi.strategy.js';
import { CardPaymentStrategy } from './card.strategy.js';
import { AppError } from '../../../core/exceptions/app.error.js';

const REGISTRY = {
  [PAYMENT_METHOD.CASH]: new CashPaymentStrategy(),
  [PAYMENT_METHOD.UPI]: new UpiPaymentStrategy(),
  [PAYMENT_METHOD.CARD]: new CardPaymentStrategy(),
};

export const PaymentStrategyFactory = {
  get(method) {
    const s = REGISTRY[method];
    if (!s) throw new AppError(`Unsupported payment method: ${method}`, 400);
    return s;
  },
};

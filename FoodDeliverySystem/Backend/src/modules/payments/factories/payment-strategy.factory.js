import { UpiStrategy } from '../strategies/upi.strategy.js';
import { CardStrategy } from '../strategies/card.strategy.js';
import { CodStrategy } from '../strategies/cod.strategy.js';
import { PAYMENT_METHODS } from '../../../core/constants/payment.constants.js';
import { BadRequestError } from '../../../core/errors/bad-request.error.js';

const registry = {
  [PAYMENT_METHODS.UPI]: new UpiStrategy(),
  [PAYMENT_METHODS.CARD]: new CardStrategy(),
  [PAYMENT_METHODS.COD]: new CodStrategy(),
};

export const getPaymentStrategy = (method) => {
  const strategy = registry[method];
  if (!strategy) throw new BadRequestError(`Unsupported payment method: ${method}`);
  return strategy;
};

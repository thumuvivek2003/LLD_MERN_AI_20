import { PAYMENT_TYPE } from '../../../common/constants/paymentType.constants.js';
import { UPIPaymentStrategy } from '../strategies/UPIPaymentStrategy.js';
import { CardPaymentStrategy } from '../strategies/CardPaymentStrategy.js';
import { WalletPaymentStrategy } from '../strategies/WalletPaymentStrategy.js';
import { CODPaymentStrategy } from '../strategies/CODPaymentStrategy.js';
import { ValidationError } from '../../../common/errors/ValidationError.js';

export class PaymentStrategyFactory {
  static create(type) {
    switch (type) {
      case PAYMENT_TYPE.UPI:
        return new UPIPaymentStrategy();
      case PAYMENT_TYPE.CARD:
        return new CardPaymentStrategy();
      case PAYMENT_TYPE.WALLET:
        return new WalletPaymentStrategy();
      case PAYMENT_TYPE.COD:
        return new CODPaymentStrategy();
      default:
        throw new ValidationError(`Unsupported payment type: ${type}`, 'INVALID_PAYMENT_TYPE');
    }
  }
}

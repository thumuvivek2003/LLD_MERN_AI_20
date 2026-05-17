import { COUPON_TYPE } from '../../../common/constants/couponType.constants.js';
import { PercentageCouponStrategy } from '../strategies/PercentageCouponStrategy.js';
import { FlatCouponStrategy } from '../strategies/FlatCouponStrategy.js';
import { FreeShippingStrategy } from '../strategies/FreeShippingStrategy.js';
import { ValidationError } from '../../../common/errors/ValidationError.js';

export class CouponStrategyFactory {
  static create(type) {
    switch (type) {
      case COUPON_TYPE.PERCENTAGE:
        return new PercentageCouponStrategy();
      case COUPON_TYPE.FLAT:
        return new FlatCouponStrategy();
      case COUPON_TYPE.FREE_SHIPPING:
        return new FreeShippingStrategy();
      default:
        throw new ValidationError(`Unsupported coupon type: ${type}`, 'INVALID_COUPON_TYPE');
    }
  }
}

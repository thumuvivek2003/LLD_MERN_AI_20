import { ICouponStrategy } from './ICouponStrategy.js';

export class FreeShippingStrategy extends ICouponStrategy {
  apply(_cart, _coupon) {
    return { discount: 0, freeShipping: true };
  }
}

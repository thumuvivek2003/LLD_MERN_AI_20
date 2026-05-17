import { CouponStrategyFactory } from '../../coupon/factories/CouponStrategyFactory.js';

export class CouponStep {
  process(context, next) {
    const coupon = context.coupon;
    if (coupon) {
      const strategy = CouponStrategyFactory.create(coupon.type);
      const result = strategy.apply(context.cart, coupon);
      context.summary.discount = result.discount || 0;
      if (result.freeShipping) context.freeShipping = true;
    }
    next();
  }
}

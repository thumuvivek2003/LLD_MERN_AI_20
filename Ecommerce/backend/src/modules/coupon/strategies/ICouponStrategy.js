/**
 * Coupon Strategy interface.
 * Implementations MUST return: { discount: number, freeShipping?: boolean }
 */
export class ICouponStrategy {
  // eslint-disable-next-line no-unused-vars
  apply(cart, coupon) {
    throw new Error('ICouponStrategy.apply() must be implemented');
  }
}

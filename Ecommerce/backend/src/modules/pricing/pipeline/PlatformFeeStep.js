export class PlatformFeeStep {
  process(context, next) {
    context.summary.platformFee = (context.cart.items || []).length === 0 ? 0 : 10;
    const { subtotal, discount, deliveryFee, platformFee } = context.summary;
    context.summary.total = Math.max(0, subtotal - discount + deliveryFee + platformFee);
    next();
  }
}

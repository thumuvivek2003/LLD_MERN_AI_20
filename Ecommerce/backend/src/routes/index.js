import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import productRoutes from '../modules/product/product.routes.js';
import cartRoutes from '../modules/cart/cart.routes.js';
import couponRoutes from '../modules/coupon/coupon.routes.js';
import checkoutRoutes from '../modules/checkout/checkout.routes.js';
import orderRoutes from '../modules/order/order.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

export function registerRoutes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/checkout', checkoutRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
}

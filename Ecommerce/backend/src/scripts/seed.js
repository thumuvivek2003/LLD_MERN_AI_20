import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.config.js';
import { User } from '../modules/user/user.model.js';
import { Product } from '../modules/product/product.model.js';
import { Coupon } from '../modules/coupon/coupon.model.js';
import { Cart } from '../modules/cart/cart.model.js';
import { Order } from '../modules/order/order.model.js';
import { COUPON_TYPE } from '../common/constants/couponType.constants.js';

async function seed() {
  await connectDB();
  console.log('[seed] clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
  ]);

  console.log('[seed] creating users...');
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);
  await User.create([
    { name: 'Admin', email: 'admin@shop.com', passwordHash: adminHash, role: 'admin' },
    { name: 'Customer', email: 'user@shop.com', passwordHash: userHash, role: 'customer' },
  ]);

  console.log('[seed] creating products...');
  await Product.insertMany([
    {
      name: 'Wireless Headphones',
      description: 'Over-ear bluetooth headphones with noise isolation.',
      price: 1999,
      image: 'https://placehold.co/400x300?text=Headphones',
      category: 'audio',
      stock: 25,
    },
    {
      name: 'Smart Watch',
      description: 'Heart rate, steps, notifications.',
      price: 2499,
      image: 'https://placehold.co/400x300?text=Watch',
      category: 'wearables',
      stock: 15,
    },
    {
      name: 'Sneakers',
      description: 'Lightweight running shoes.',
      price: 1299,
      image: 'https://placehold.co/400x300?text=Sneakers',
      category: 'fashion',
      stock: 30,
    },
    {
      name: 'Backpack',
      description: '20L casual backpack.',
      price: 799,
      image: 'https://placehold.co/400x300?text=Backpack',
      category: 'fashion',
      stock: 40,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable speaker with 10h battery.',
      price: 1499,
      image: 'https://placehold.co/400x300?text=Speaker',
      category: 'audio',
      stock: 20,
    },
    {
      name: 'Sunglasses',
      description: 'UV-protected polarized sunglasses.',
      price: 599,
      image: 'https://placehold.co/400x300?text=Sunglasses',
      category: 'fashion',
      stock: 50,
    },
  ]);

  console.log('[seed] creating coupons...');
  await Coupon.insertMany([
    { code: 'SAVE10', type: COUPON_TYPE.PERCENTAGE, value: 10, minCartValue: 500, description: '10% off on orders above ₹500', active: true },
    { code: 'FLAT100', type: COUPON_TYPE.FLAT, value: 100, minCartValue: 800, description: 'Flat ₹100 off on orders above ₹800', active: true },
    { code: 'FREESHIP', type: COUPON_TYPE.FREE_SHIPPING, value: 0, minCartValue: 0, description: 'Free shipping', active: true },
  ]);

  console.log('[seed] done.');
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error('[seed] failed:', err);
  try { await mongoose.connection.close(); } catch {}
  process.exit(1);
});

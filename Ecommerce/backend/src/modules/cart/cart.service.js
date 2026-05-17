import { cartRepository } from './cart.repository.js';
import { productRepository } from '../product/product.repository.js';
import { couponService } from '../coupon/coupon.service.js';
import { pricingService } from '../pricing/PricingService.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { itemSubtotal } from '../../common/utils/price.util.js';

export class CartService {
  constructor(repo = cartRepository) {
    this.repo = repo;
  }

  _serialize(cart) {
    const items = (cart.items || []).map((it) => ({
      productId: it.productId,
      name: it.name,
      image: it.image,
      price: it.price,
      quantity: it.quantity,
      subtotal: itemSubtotal(it),
    }));
    const pricing = pricingService.calculate({ items, appliedCoupon: cart.appliedCoupon });
    return {
      _id: cart._id,
      userId: cart.userId,
      items,
      appliedCoupon: cart.appliedCoupon || null,
      pricing,
    };
  }

  async getCart(userId) {
    const cart = await this.repo.findOrCreateForUser(userId);
    return this._serialize(cart);
  }

  async addItem(userId, { productId, quantity = 1 }) {
    if (!productId) throw new ValidationError('productId is required');
    if (quantity < 1) throw new ValidationError('quantity must be >= 1');
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.stock < quantity) throw new ValidationError('Insufficient stock', 'OUT_OF_STOCK');

    const cart = await this.repo.findOrCreateForUser(userId);
    const existing = cart.items.find((i) => String(i.productId) === String(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }
    await cart.save();
    return this._serialize(cart);
  }

  async updateQuantity(userId, productId, quantity) {
    if (quantity < 1) throw new ValidationError('quantity must be >= 1');
    const cart = await this.repo.findOrCreateForUser(userId);
    const item = cart.items.find((i) => String(i.productId) === String(productId));
    if (!item) throw new NotFoundError('Item not in cart');
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.stock < quantity) throw new ValidationError('Insufficient stock', 'OUT_OF_STOCK');
    item.quantity = quantity;
    await cart.save();
    return this._serialize(cart);
  }

  async removeItem(userId, productId) {
    const cart = await this.repo.findOrCreateForUser(userId);
    cart.items = cart.items.filter((i) => String(i.productId) !== String(productId));
    if (cart.items.length === 0) cart.appliedCoupon = null;
    await cart.save();
    return this._serialize(cart);
  }

  async applyCoupon(userId, code) {
    if (!code) throw new ValidationError('code is required');
    const cart = await this.repo.findOrCreateForUser(userId);
    if (cart.items.length === 0) throw new ValidationError('Cart is empty', 'CART_EMPTY');
    const coupon = await couponService.validateCoupon(code, userId, cart);
    cart.appliedCoupon = { code: coupon.code, type: coupon.type, value: coupon.value };
    await cart.save();
    return this._serialize(cart);
  }

  async removeCoupon(userId) {
    const cart = await this.repo.findOrCreateForUser(userId);
    cart.appliedCoupon = null;
    await cart.save();
    return this._serialize(cart);
  }

  async clearCart(userId) {
    const cart = await this.repo.findOrCreateForUser(userId);
    cart.items = [];
    cart.appliedCoupon = null;
    await cart.save();
    return this._serialize(cart);
  }
}

export const cartService = new CartService();

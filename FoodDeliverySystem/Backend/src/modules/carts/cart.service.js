import { cartRepository } from './cart.repository.js';
import { menuItemRepository } from '../menu-items/menu-item.repository.js';
import { NotFoundError } from '../../core/errors/not-found.error.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { toCartDto } from './cart.mapper.js';

class CartService {
  async getCart(userId) {
    const cart = await cartRepository.upsertEmpty(userId);
    return toCartDto(cart);
  }

  async addCartItem(userId, { menuItemId, quantity = 1 }) {
    const item = await menuItemRepository.findById(menuItemId);
    if (!item) throw new NotFoundError('Menu item not found');
    if (!item.isAvailable) throw new BadRequestError('Item not available');

    const cart = await cartRepository.upsertEmpty(userId);

    if (cart.restaurantId && cart.restaurantId.toString() !== item.restaurantId.toString()) {
      throw new BadRequestError('Clear cart before ordering from another restaurant');
    }
    if (!cart.restaurantId) cart.restaurantId = item.restaurantId;

    const existing = cart.items.find((i) => i.menuItemId.toString() === item._id.toString());
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity,
      });
    }
    await cart.save();
    return toCartDto(cart);
  }

  async removeCartItem(userId, menuItemId) {
    const cart = await cartRepository.findCartByUserId(userId);
    if (!cart) throw new NotFoundError('Cart not found');
    cart.items = cart.items.filter((i) => i.menuItemId.toString() !== menuItemId);
    if (cart.items.length === 0) cart.restaurantId = null;
    await cart.save();
    return toCartDto(cart);
  }

  async updateQuantity(userId, menuItemId, quantity) {
    if (quantity < 1) return this.removeCartItem(userId, menuItemId);
    const cart = await cartRepository.findCartByUserId(userId);
    if (!cart) throw new NotFoundError('Cart not found');
    const target = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!target) throw new NotFoundError('Item not in cart');
    target.quantity = quantity;
    await cart.save();
    return toCartDto(cart);
  }

  async clearCart(userId) {
    const cart = await cartRepository.findCartByUserId(userId);
    if (!cart) return toCartDto(null);
    cart.items = [];
    cart.restaurantId = null;
    await cart.save();
    return toCartDto(cart);
  }

  calculateCartTotal(cart) {
    return (cart.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
  }
}

export const cartService = new CartService();

import { BaseRepository } from '../../core/base/base.repository.js';
import { CartModel } from './cart.model.js';

class CartRepository extends BaseRepository {
  constructor() {
    super(CartModel);
  }

  findCartByUserId(userId) {
    return this.model.findOne({ userId });
  }

  async upsertEmpty(userId) {
    let cart = await this.model.findOne({ userId });
    if (!cart) cart = await this.model.create({ userId, items: [], restaurantId: null });
    return cart;
  }
}

export const cartRepository = new CartRepository();

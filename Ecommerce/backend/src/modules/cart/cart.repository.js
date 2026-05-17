import { BaseRepository } from '../../common/database/BaseRepository.js';
import { Cart } from './cart.model.js';

export class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  findByUserId(userId) {
    return this.model.findOne({ userId });
  }

  async findOrCreateForUser(userId) {
    let cart = await this.model.findOne({ userId });
    if (!cart) cart = await this.model.create({ userId, items: [], appliedCoupon: null });
    return cart;
  }
}

export const cartRepository = new CartRepository();

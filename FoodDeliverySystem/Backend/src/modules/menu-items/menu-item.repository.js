import { BaseRepository } from '../../core/base/base.repository.js';
import { MenuItemModel } from './menu-item.model.js';

class MenuItemRepository extends BaseRepository {
  constructor() {
    super(MenuItemModel);
  }

  findMenuByRestaurantId(restaurantId) {
    return this.model.find({ restaurantId });
  }

  findAvailableByRestaurant(restaurantId) {
    return this.model.find({ restaurantId, isAvailable: true });
  }
}

export const menuItemRepository = new MenuItemRepository();

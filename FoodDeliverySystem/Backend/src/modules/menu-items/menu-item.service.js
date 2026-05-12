import { menuItemRepository } from './menu-item.repository.js';
import { NotFoundError } from '../../core/errors/not-found.error.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { toMenuItemDto, toMenuItemDtoList } from './menu-item.mapper.js';

class MenuItemService {
  async createMenuItem(payload) {
    if (!payload.restaurantId) throw new BadRequestError('restaurantId is required');
    if (payload.price == null || payload.price < 0) throw new BadRequestError('Valid price required');
    const item = await menuItemRepository.create(payload);
    return toMenuItemDto(item);
  }

  async updateMenuItem(id, payload) {
    const item = await menuItemRepository.updateById(id, payload);
    if (!item) throw new NotFoundError('Menu item not found');
    return toMenuItemDto(item);
  }

  async toggleAvailability(id) {
    const item = await menuItemRepository.findById(id);
    if (!item) throw new NotFoundError('Menu item not found');
    item.isAvailable = !item.isAvailable;
    await item.save();
    return toMenuItemDto(item);
  }

  async deleteMenuItem(id) {
    const item = await menuItemRepository.deleteById(id);
    if (!item) throw new NotFoundError('Menu item not found');
    return { id };
  }

  async getMenuByRestaurant(restaurantId, opts = {}) {
    const list = opts.availableOnly
      ? await menuItemRepository.findAvailableByRestaurant(restaurantId)
      : await menuItemRepository.findMenuByRestaurantId(restaurantId);
    return toMenuItemDtoList(list);
  }

  async getMenuItemById(id) {
    const item = await menuItemRepository.findById(id);
    if (!item) throw new NotFoundError('Menu item not found');
    return toMenuItemDto(item);
  }
}

export const menuItemService = new MenuItemService();

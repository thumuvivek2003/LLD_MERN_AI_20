import { restaurantRepository } from './restaurant.repository.js';
import { NotFoundError } from '../../core/errors/not-found.error.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { toRestaurantDto, toRestaurantDtoList } from './restaurant.mapper.js';
import { userRepository } from '../users/user.repository.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';

class RestaurantService {
  async createRestaurant(payload) {
    if (!payload.name || !payload.address) throw new BadRequestError('Name and address required');
    const r = await restaurantRepository.create(payload);
    return toRestaurantDto(r);
  }

  async updateRestaurant(id, payload) {
    const r = await restaurantRepository.updateById(id, payload);
    if (!r) throw new NotFoundError('Restaurant not found');
    return toRestaurantDto(r);
  }

  async getNearbyRestaurants({ lat, lng } = {}) {
    const list = await restaurantRepository.findNearbyRestaurants({
      lat: lat != null ? Number(lat) : null,
      lng: lng != null ? Number(lng) : null,
    });
    return list.map(({ restaurant, distanceKm }) =>
      toRestaurantDto(restaurant, distanceKm ?? undefined)
    );
  }

  async getAllRestaurants() {
    const all = await restaurantRepository.findAll();
    return toRestaurantDtoList(all);
  }

  async getRestaurantById(id) {
    const r = await restaurantRepository.findById(id);
    if (!r) throw new NotFoundError('Restaurant not found');
    return toRestaurantDto(r);
  }

  async assignAdminToRestaurant(restaurantId, adminUserId) {
    const admin = await userRepository.findById(adminUserId);
    if (!admin) throw new NotFoundError('Admin user not found');
    if (admin.role !== USER_ROLES.RESTAURANT_ADMIN) {
      throw new BadRequestError('User must have RESTAURANT_ADMIN role');
    }
    const r = await restaurantRepository.assignAdmin(restaurantId, adminUserId);
    if (!r) throw new NotFoundError('Restaurant not found');
    return toRestaurantDto(r);
  }

  async getRestaurantByManager(userId) {
    const r = await restaurantRepository.findByManager(userId);
    return r ? toRestaurantDto(r) : null;
  }
}

export const restaurantService = new RestaurantService();

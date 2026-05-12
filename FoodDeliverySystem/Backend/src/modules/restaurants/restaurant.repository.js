import { BaseRepository } from '../../core/base/base.repository.js';
import { RestaurantModel } from './restaurant.model.js';
import { calculateDistance } from '../../core/utils/geo.util.js';

class RestaurantRepository extends BaseRepository {
  constructor() {
    super(RestaurantModel);
  }

  async findNearbyRestaurants({ lat, lng, maxKm = 50 } = {}) {
    const all = await this.model.find({ isActive: true });
    if (lat == null || lng == null) return all.map((r) => ({ restaurant: r, distanceKm: null }));
    return all
      .map((r) => ({ restaurant: r, distanceKm: calculateDistance(lat, lng, r.latitude, r.longitude) }))
      .filter((x) => x.distanceKm <= maxKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  assignAdmin(restaurantId, adminUserId) {
    return this.model.findByIdAndUpdate(restaurantId, { managedBy: adminUserId }, { new: true });
  }

  findByManager(userId) {
    return this.model.findOne({ managedBy: userId });
  }
}

export const restaurantRepository = new RestaurantRepository();

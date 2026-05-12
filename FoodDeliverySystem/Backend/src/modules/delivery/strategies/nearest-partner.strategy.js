import { AssignmentStrategy } from './assignment-strategy.interface.js';
import { calculateDistance } from '../../../core/utils/geo.util.js';

export class NearestPartnerStrategy extends AssignmentStrategy {
  async assign({ partners, restaurant }) {
    if (!partners.length) return null;
    return partners
      .map((p) => ({
        partner: p,
        distance: calculateDistance(restaurant.latitude, restaurant.longitude, p.location?.lat, p.location?.lng),
      }))
      .sort((a, b) => a.distance - b.distance)[0].partner;
  }
}

import { DriverMatchingStrategy } from './driver-matching.strategy.js';
import { haversineKm } from '../../../core/utils/distance.util.js';

export class NearestDriverStrategy extends DriverMatchingStrategy {
  match(drivers, ride) {
    if (!drivers?.length) return [];
    return [...drivers]
      .map((d) => ({ d, dist: haversineKm(d.currentLocation, ride.pickup) }))
      .sort((a, b) => a.dist - b.dist)
      .map((x) => x.d);
  }
}

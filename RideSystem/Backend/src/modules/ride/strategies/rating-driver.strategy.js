import { DriverMatchingStrategy } from './driver-matching.strategy.js';

export class RatingDriverStrategy extends DriverMatchingStrategy {
  match(drivers) {
    return [...(drivers || [])].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
}

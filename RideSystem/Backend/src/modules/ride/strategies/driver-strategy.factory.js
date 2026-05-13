import { NearestDriverStrategy } from './nearest-driver.strategy.js';
import { RatingDriverStrategy } from './rating-driver.strategy.js';

const STRATEGIES = {
  NEAREST: new NearestDriverStrategy(),
  RATING: new RatingDriverStrategy(),
};

export const DriverStrategyFactory = {
  get(name = 'NEAREST') {
    return STRATEGIES[name] || STRATEGIES.NEAREST;
  },
};

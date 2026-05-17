import { STRATEGY_TYPES } from '../constants/strategyTypes.js';
import { FixedWindowStrategy } from '../strategies/FixedWindowStrategy.js';
import { SlidingWindowStrategy } from '../strategies/SlidingWindowStrategy.js';
import { TokenBucketStrategy } from '../strategies/TokenBucketStrategy.js';
import { AppError } from '../../../shared/exceptions/AppError.js';

export function createStrategy(type) {
  switch (type) {
    case STRATEGY_TYPES.FIXED_WINDOW:
      return new FixedWindowStrategy();
    case STRATEGY_TYPES.SLIDING_WINDOW:
      return new SlidingWindowStrategy();
    case STRATEGY_TYPES.TOKEN_BUCKET:
      return new TokenBucketStrategy();
    default:
      throw new AppError(`Unknown strategy type: ${type}`, 400, 'UNKNOWN_STRATEGY');
  }
}

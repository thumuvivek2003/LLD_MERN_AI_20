import { FixedIncrementStrategy } from './incrementStrategies/fixedIncrement.strategy.js';
import { PercentageIncrementStrategy } from './incrementStrategies/percentageIncrement.strategy.js';
import { INCREMENT_TYPE } from '../../../shared/constants/auctionStatus.constant.js';
import { ValidationError } from '../../../shared/errors/validation.error.js';

export function createIncrementStrategy(increment) {
  switch (increment.type) {
    case INCREMENT_TYPE.FIXED:
      return new FixedIncrementStrategy(increment.value);
    case INCREMENT_TYPE.PERCENTAGE:
      return new PercentageIncrementStrategy(increment.value);
    default:
      throw new ValidationError(`Unknown increment type: ${increment.type}`);
  }
}

import { StrategyFactory } from '../factories/StrategyFactory.js';
import { FareCalculator } from '../utils/FareCalculator.js';

export class PricingService {
  calculate(entryTime, exitTime, vehicleType) {
    const strategy = StrategyFactory.pricing(entryTime);
    return new FareCalculator(strategy).calculate(entryTime, exitTime, vehicleType);
  }
}

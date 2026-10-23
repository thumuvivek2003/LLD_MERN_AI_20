import { PricingStrategy } from './PricingStrategy.js';
import { PRICING } from '../../config/constants.js';

export class WeekdayPricingStrategy extends PricingStrategy {
  calculate(entryTime, exitTime) {
    const hours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));
    return Math.max(1, hours) * PRICING.WEEKDAY_HOURLY;
  }
}

import { HourlyPricingStrategy } from './hourly-pricing.strategy.js';

const WEEKEND_MULTIPLIER = 1.5;

export class WeekendPricingStrategy extends HourlyPricingStrategy {
  calculate(durationHours, vehicleType) {
    return Math.ceil(super.calculate(durationHours, vehicleType) * WEEKEND_MULTIPLIER);
  }
}

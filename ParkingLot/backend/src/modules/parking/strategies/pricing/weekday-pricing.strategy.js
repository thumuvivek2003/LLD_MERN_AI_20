import { HourlyPricingStrategy } from './hourly-pricing.strategy.js';

export class WeekdayPricingStrategy extends HourlyPricingStrategy {
  calculate(durationHours, vehicleType) {
    return super.calculate(durationHours, vehicleType);
  }
}

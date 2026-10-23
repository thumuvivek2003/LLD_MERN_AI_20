import { PricingStrategy } from './pricing-strategy.js';
import { VehicleType } from '../../../../shared/enums/vehicle-type.enum.js';

const RATES = {
  [VehicleType.TWO_WHEELER]: 10,
  [VehicleType.FOUR_WHEELER]: 25,
  [VehicleType.HEAVY]: 60,
};

export class HourlyPricingStrategy extends PricingStrategy {
  calculate(durationHours, vehicleType) {
    const hours = Math.max(1, Math.ceil(durationHours));
    return hours * (RATES[vehicleType] ?? RATES[VehicleType.FOUR_WHEELER]);
  }
}

import { PricingStrategy } from './pricing-strategy.js';
import { VehicleType } from '../../../../shared/enums/vehicle-type.enum.js';

const FLAT_RATES = {
  [VehicleType.TWO_WHEELER]: 30,
  [VehicleType.FOUR_WHEELER]: 80,
  [VehicleType.HEAVY]: 200,
};

export class FlatPricingStrategy extends PricingStrategy {
  calculate(_durationHours, vehicleType) {
    return FLAT_RATES[vehicleType] ?? FLAT_RATES[VehicleType.FOUR_WHEELER];
  }
}

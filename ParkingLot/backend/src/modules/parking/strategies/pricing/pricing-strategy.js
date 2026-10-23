export class PricingStrategy {
  calculate(_durationHours, _vehicleType) {
    throw new Error('PricingStrategy.calculate must be implemented');
  }
}

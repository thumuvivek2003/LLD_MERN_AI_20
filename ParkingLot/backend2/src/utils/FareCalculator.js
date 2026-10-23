export class FareCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  calculate(entryTime, exitTime, vehicleType) {
    return this.strategy.calculate(entryTime, exitTime, vehicleType);
  }
}

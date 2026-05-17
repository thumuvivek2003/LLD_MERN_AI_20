// PERCENTAGE: next bid must be at least currentHighest * (1 + value/100).
export class PercentageIncrementStrategy {
  constructor(value) {
    this.value = value;
  }

  validateIncrement(currentHighest, amount) {
    if (currentHighest === 0) return true; // increment percentage from 0 is meaningless
    return amount >= currentHighest * (1 + this.value / 100);
  }

  describe() {
    return `PERCENTAGE(+${this.value}%)`;
  }
}

// FIXED: next bid must be at least (currentHighest + value).
// When no bids yet, currentHighest is 0 — caller must compare against startPrice
// in MinimumBidValidator before this runs.
export class FixedIncrementStrategy {
  constructor(value) {
    this.value = value;
  }

  validateIncrement(currentHighest, amount) {
    return amount - currentHighest >= this.value;
  }

  describe() {
    return `FIXED(+${this.value})`;
  }
}

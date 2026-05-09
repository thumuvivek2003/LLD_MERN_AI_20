import { FineStrategy } from './FineStrategy.js';

export class PremiumUserFineStrategy extends FineStrategy {
  calculate(overdueDays) {
    return overdueDays * 2;
  }
}

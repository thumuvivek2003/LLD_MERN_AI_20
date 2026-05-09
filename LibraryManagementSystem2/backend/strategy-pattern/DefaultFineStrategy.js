import { FineStrategy } from './FineStrategy.js';

export class DefaultFineStrategy extends FineStrategy {
  calculate(overdueDays) {
    return overdueDays * 5;
  }
}

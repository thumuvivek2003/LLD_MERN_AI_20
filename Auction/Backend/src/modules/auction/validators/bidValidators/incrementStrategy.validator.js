import { BaseBidValidator } from './baseBid.validator.js';
import { DomainRuleError } from '../../../../shared/errors/validation.error.js';
import { createIncrementStrategy } from '../../strategies/strategyFactory.js';

export class IncrementStrategyValidator extends BaseBidValidator {
  async check({ auction, amount }) {
    // skip if there is no previous highest — minimumBid already enforced startPrice
    if (!auction.currentHighestBid || auction.currentHighestBid <= 0) return;
    const strategy = createIncrementStrategy(auction.increment);
    if (!strategy.validateIncrement(auction.currentHighestBid, amount)) {
      throw new DomainRuleError(
        `Bid does not meet increment rule ${strategy.describe()}`,
        'BID_INCREMENT_INVALID',
      );
    }
  }
}

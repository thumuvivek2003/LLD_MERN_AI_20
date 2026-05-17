import { BaseBidValidator } from './baseBid.validator.js';
import { DomainRuleError } from '../../../../shared/errors/validation.error.js';

export class MinimumBidValidator extends BaseBidValidator {
  async check({ auction, amount }) {
    if (auction.currentHighestBid > 0) {
      if (amount <= auction.currentHighestBid) {
        throw new DomainRuleError(
          `Bid must exceed current highest bid (${auction.currentHighestBid})`,
          'BID_TOO_LOW',
        );
      }
    } else if (amount < auction.startPrice) {
      throw new DomainRuleError(
        `First bid must be at least startPrice (${auction.startPrice})`,
        'BID_BELOW_START',
      );
    }
  }
}

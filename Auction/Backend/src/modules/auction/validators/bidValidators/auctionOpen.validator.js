import { BaseBidValidator } from './baseBid.validator.js';
import { DomainRuleError } from '../../../../shared/errors/validation.error.js';
import { AUCTION_STATUS } from '../../../../shared/constants/auctionStatus.constant.js';

export class AuctionOpenValidator extends BaseBidValidator {
  async check({ auction }) {
    if (auction.status !== AUCTION_STATUS.OPEN) {
      throw new DomainRuleError(`Auction is ${auction.status}, bids only accepted when OPEN`, 'AUCTION_NOT_OPEN');
    }
  }
}

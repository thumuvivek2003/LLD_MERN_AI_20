import { BaseAuctionState } from './baseAuction.state.js';
import { DomainRuleError } from '../../../shared/errors/validation.error.js';

export class CancelledAuctionState extends BaseAuctionState {
  async placeBid() {
    throw new DomainRuleError('Auction was cancelled', 'AUCTION_CANCELLED');
  }
  async closeAuction({ auction }) {
    return auction;
  }
}

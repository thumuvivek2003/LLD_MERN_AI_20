import { BaseAuctionState } from './baseAuction.state.js';
import { DomainRuleError } from '../../../shared/errors/validation.error.js';

export class ClosedAuctionState extends BaseAuctionState {
  async placeBid() {
    throw new DomainRuleError('Auction is closed', 'AUCTION_CLOSED');
  }
  async closeAuction({ auction }) {
    // idempotent — return current auction
    return auction;
  }
}

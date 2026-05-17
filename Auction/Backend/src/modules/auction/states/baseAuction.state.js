import { DomainRuleError } from '../../../shared/errors/validation.error.js';

// State pattern base. Each concrete state owns transitions it allows.
// Returns are: { auction: <updated>, bid?: <bid> } so callers can publish events.
export class BaseAuctionState {
  async placeBid(_ctx) {
    throw new DomainRuleError('Bidding is not allowed in this auction state', 'INVALID_STATE_TRANSITION');
  }

  async closeAuction(_ctx) {
    throw new DomainRuleError('Auction cannot be closed from this state', 'INVALID_STATE_TRANSITION');
  }

  async startAuction(_ctx) {
    throw new DomainRuleError('Auction cannot be started from this state', 'INVALID_STATE_TRANSITION');
  }
}

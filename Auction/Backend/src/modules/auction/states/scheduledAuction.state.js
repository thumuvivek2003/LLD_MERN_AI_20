import { BaseAuctionState } from './baseAuction.state.js';
import { DomainRuleError } from '../../../shared/errors/validation.error.js';
import { AUCTION_STATUS } from '../../../shared/constants/auctionStatus.constant.js';
import { auctionRepository } from '../repositories/auction.repository.js';
import { eventBus } from '../../../shared/eventBus/eventBus.singleton.js';
import { AUCTION_EVENTS } from '../events/auction.events.js';
import { buildAuctionStartedEvent } from '../events/auctionClosed.event.js';

export class ScheduledAuctionState extends BaseAuctionState {
  async placeBid() {
    throw new DomainRuleError('Auction has not started yet', 'AUCTION_NOT_OPEN');
  }

  async startAuction({ auction }) {
    const updated = await auctionRepository.updateWithVersion(auction.id, auction.version, {
      $set: { status: AUCTION_STATUS.OPEN },
    });
    if (!updated) return null; // caller retries
    eventBus.publish(AUCTION_EVENTS.AUCTION_STARTED, buildAuctionStartedEvent(updated.toJSON()));
    return updated;
  }

  async closeAuction({ auction }) {
    // Manual admin close on a never-opened auction => CANCELLED
    const updated = await auctionRepository.updateWithVersion(auction.id, auction.version, {
      $set: { status: AUCTION_STATUS.CANCELLED },
    });
    return updated;
  }
}

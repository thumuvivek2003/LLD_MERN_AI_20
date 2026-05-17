import { BaseAuctionState } from './baseAuction.state.js';
import { AUCTION_STATUS } from '../../../shared/constants/auctionStatus.constant.js';
import { auctionRepository } from '../repositories/auction.repository.js';
import { bidRepository } from '../repositories/bid.repository.js';
import { eventBus } from '../../../shared/eventBus/eventBus.singleton.js';
import { AUCTION_EVENTS } from '../events/auction.events.js';
import { buildBidPlacedEvent } from '../events/bidPlaced.event.js';
import { buildAuctionClosedEvent } from '../events/auctionClosed.event.js';

export class OpenAuctionState extends BaseAuctionState {
  // ctx: { auction, user, amount }
  async placeBid({ auction, user, amount }) {
    // optimistic update: only mutates if version still matches
    const updated = await auctionRepository.updateWithVersion(auction.id, auction.version, {
      $set: {
        currentHighestBid: amount,
        highestBidderId: user.id,
        highestBidderName: user.name,
      },
    });
    if (!updated) return null; // version conflict — caller retries

    const bid = await bidRepository.createBid({
      auctionId: updated._id,
      bidderId: user.id,
      bidderName: user.name,
      amount,
      timestamp: new Date(),
    });

    eventBus.publish(
      AUCTION_EVENTS.NEW_HIGHEST_BID,
      buildBidPlacedEvent({ auction: updated.toJSON(), bid: bid.toJSON() }),
    );

    return { auction: updated, bid };
  }

  async closeAuction({ auction }) {
    const winnerId = auction.highestBidderId || null;
    const winnerName = auction.highestBidderName || null;
    const finalAmount = auction.currentHighestBid > 0 ? auction.currentHighestBid : null;

    const updated = await auctionRepository.updateWithVersion(auction.id, auction.version, {
      $set: {
        status: AUCTION_STATUS.CLOSED,
        winnerId,
        winnerName,
        finalAmount,
      },
    });
    if (!updated) return null;
    eventBus.publish(AUCTION_EVENTS.AUCTION_CLOSED, buildAuctionClosedEvent(updated.toJSON()));
    return updated;
  }
}

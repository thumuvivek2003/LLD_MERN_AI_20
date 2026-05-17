import { eventBus } from '../../../shared/eventBus/eventBus.singleton.js';
import { AUCTION_EVENTS } from '../events/auction.events.js';
import { logInfo } from '../../../shared/utils/logger.util.js';

export function registerAuditLogSubscriber() {
  eventBus.subscribe(AUCTION_EVENTS.NEW_HIGHEST_BID, (p) =>
    logInfo(`[AUDIT] bid auction=${p.auctionId} amount=${p.amount} bidder=${p.bidderName}`),
  );
  eventBus.subscribe(AUCTION_EVENTS.AUCTION_STARTED, (p) =>
    logInfo(`[AUDIT] auction.started ${p.auctionId}`),
  );
  eventBus.subscribe(AUCTION_EVENTS.AUCTION_CLOSED, (p) =>
    logInfo(
      `[AUDIT] auction.closed ${p.auctionId} winner=${p.winnerName ?? 'none'} final=${p.finalAmount ?? 'n/a'}`,
    ),
  );
}

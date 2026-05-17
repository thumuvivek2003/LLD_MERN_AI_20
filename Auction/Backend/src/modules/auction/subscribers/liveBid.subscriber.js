import { eventBus } from '../../../shared/eventBus/eventBus.singleton.js';
import { socketManager } from '../../../shared/socket/socketManager.singleton.js';
import { AUCTION_EVENTS } from '../events/auction.events.js';

export function registerLiveBidSubscriber() {
  eventBus.subscribe(AUCTION_EVENTS.NEW_HIGHEST_BID, (payload) => {
    socketManager.emitToRoom(`auction:${payload.auctionId}`, 'bid:new', payload);
  });

  eventBus.subscribe(AUCTION_EVENTS.AUCTION_STARTED, (payload) => {
    socketManager.emitToRoom(`auction:${payload.auctionId}`, 'auction:started', payload);
  });
}

import { eventBus } from '../../../shared/eventBus/eventBus.singleton.js';
import { socketManager } from '../../../shared/socket/socketManager.singleton.js';
import { AUCTION_EVENTS } from '../events/auction.events.js';
import { walletService } from '../../wallet/services/wallet.service.js';
import { logError, logInfo } from '../../../shared/utils/logger.util.js';

export function registerAuctionCloseSubscriber() {
  eventBus.subscribe(AUCTION_EVENTS.AUCTION_CLOSED, async (payload) => {
    socketManager.emitToRoom(`auction:${payload.auctionId}`, 'auction:closed', payload);

    // Settle the winner's wallet only when a winner exists.
    if (payload.winnerId && payload.finalAmount) {
      try {
        await walletService.debitBalance(payload.winnerId, payload.finalAmount);
        logInfo(`Settled auction ${payload.auctionId}: debited ${payload.finalAmount} from ${payload.winnerId}`);
      } catch (err) {
        logError(`Settlement failed for auction ${payload.auctionId}`, err);
      }
    }
  });
}

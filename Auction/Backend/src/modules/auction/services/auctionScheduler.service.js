import { auctionRepository } from '../repositories/auction.repository.js';
import { createAuctionState } from '../states/auctionState.factory.js';
import { auctionLockManager } from '../../../shared/locks/auctionLockManager.singleton.js';
import { logError } from '../../../shared/utils/logger.util.js';

async function tryTransition(auction, action) {
  // action is 'start' or 'close'
  return auctionLockManager.lock(auction.id, async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const fresh = await auctionRepository.findById(auction.id);
      if (!fresh) return null;
      const state = createAuctionState(fresh.status);
      const updated = action === 'start' ? await state.startAuction({ auction: fresh }) : await state.closeAuction({ auction: fresh });
      if (updated) return updated;
    }
    return null;
  });
}

export const auctionScheduler = {
  async autoStartAuction() {
    const due = await auctionRepository.findScheduledDue();
    for (const a of due) {
      try {
        await tryTransition(a, 'start');
      } catch (err) {
        logError(`autoStartAuction failed for ${a.id}`, err);
      }
    }
  },

  async autoCloseAuction() {
    const expired = await auctionRepository.findOpenExpired();
    for (const a of expired) {
      try {
        await tryTransition(a, 'close');
      } catch (err) {
        logError(`autoCloseAuction failed for ${a.id}`, err);
      }
    }
  },
};

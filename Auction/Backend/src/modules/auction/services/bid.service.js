import { auctionRepository } from '../repositories/auction.repository.js';
import { bidRepository } from '../repositories/bid.repository.js';
import { auctionLockManager } from '../../../shared/locks/auctionLockManager.singleton.js';
import { buildValidationChain } from '../validators/bidValidationChain.builder.js';
import { createAuctionState } from '../states/auctionState.factory.js';
import { AppError } from '../../../shared/errors/app.error.js';
import { toAuctionDTO } from '../dtos/auction.dto.js';
import { toBidDTO } from '../dtos/bid.dto.js';

const MAX_RETRIES = 3;
const validationChain = buildValidationChain();

export const bidService = {
  async placeBid({ auctionId, user, amount }) {
    // Mutex per auction id — keeps the validate-then-optimistic-update window tight.
    return auctionLockManager.lock(auctionId, async () => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const auction = await auctionRepository.findById(auctionId);
        if (!auction) throw new AppError('Auction not found', 404, 'AUCTION_NOT_FOUND');

        // 1) full validation chain (state, time, eligibility, min, increment, wallet)
        await validationChain.validate({ auction, user, amount });

        // 2) delegate the actual mutation to the auction state
        const state = createAuctionState(auction.status);
        const result = await state.placeBid({ auction, user, amount });

        if (result) {
          return {
            auction: toAuctionDTO(result.auction),
            bid: toBidDTO(result.bid),
          };
        }
        // version conflict -> retry
      }
      throw new AppError('Could not place bid after retries (concurrent update)', 409, 'VERSION_CONFLICT');
    });
  },

  async getAuctionBids(auctionId) {
    const bids = await bidRepository.getAuctionBids(auctionId);
    return bids.map(toBidDTO);
  },
};

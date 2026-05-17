import { auctionRepository } from '../repositories/auction.repository.js';
import { bidRepository } from '../repositories/bid.repository.js';
import { userRepository } from '../../user/repositories/user.repository.js';
import { createAuctionState } from '../states/auctionState.factory.js';
import { AppError } from '../../../shared/errors/app.error.js';
import { ValidationError } from '../../../shared/errors/validation.error.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';
import { AUCTION_STATUS } from '../../../shared/constants/auctionStatus.constant.js';
import { auctionLockManager } from '../../../shared/locks/auctionLockManager.singleton.js';
import { toAuctionDTO } from '../dtos/auction.dto.js';
import { toBidDTO } from '../dtos/bid.dto.js';

async function loadAuctionOrThrow(id) {
  const auction = await auctionRepository.findById(id);
  if (!auction) throw new AppError('Auction not found', 404, 'AUCTION_NOT_FOUND');
  return auction;
}

export const auctionService = {
  async createAuction(payload, creator) {
    // validate eligible users — they must exist and be MEMBERs
    if (payload.eligibleUserIds?.length) {
      const users = await userRepository.findManyByIds(payload.eligibleUserIds);
      if (users.length !== payload.eligibleUserIds.length) {
        throw new ValidationError('One or more eligibleUserIds do not exist');
      }
      const nonMember = users.find((u) => u.role !== ROLES.MEMBER);
      if (nonMember) {
        throw new ValidationError(`User ${nonMember.email} is not a MEMBER`);
      }
    }

    const doc = await auctionRepository.create({
      item: payload.item,
      startPrice: payload.startPrice,
      startTime: new Date(payload.startTime),
      endTime: new Date(payload.endTime),
      increment: payload.increment,
      eligibleUserIds: payload.eligibleUserIds,
      createdBy: creator.id,
      status: AUCTION_STATUS.SCHEDULED,
      currentHighestBid: 0,
    });
    return toAuctionDTO(doc);
  },

  async getAuctionDetails(id) {
    const auction = await loadAuctionOrThrow(id);
    const bids = await bidRepository.getAuctionBids(id);
    return { auction: toAuctionDTO(auction), bids: bids.map(toBidDTO) };
  },

  async list(query) {
    const { auctions, total } = await auctionRepository.list(query);
    return { auctions: auctions.map(toAuctionDTO), total };
  },

  async getLive() {
    const auctions = await auctionRepository.getLiveAuctions();
    return auctions.map(toAuctionDTO);
  },

  async closeAuction(id) {
    // Lock so a concurrent bid+close don't race.
    return auctionLockManager.lock(id, async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const auction = await loadAuctionOrThrow(id);
        const state = createAuctionState(auction.status);
        const updated = await state.closeAuction({ auction });
        if (updated) return toAuctionDTO(updated);
      }
      throw new AppError('Could not close auction due to concurrent updates', 409, 'VERSION_CONFLICT');
    });
  },

  async startAuction(id) {
    return auctionLockManager.lock(id, async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const auction = await loadAuctionOrThrow(id);
        if (auction.status !== AUCTION_STATUS.SCHEDULED) return toAuctionDTO(auction);
        const state = createAuctionState(auction.status);
        const updated = await state.startAuction({ auction });
        if (updated) return toAuctionDTO(updated);
      }
      throw new AppError('Could not start auction due to concurrent updates', 409, 'VERSION_CONFLICT');
    });
  },

  async assignEligibleUsers(id, userIds) {
    const auction = await loadAuctionOrThrow(id);
    if (auction.status === AUCTION_STATUS.CLOSED || auction.status === AUCTION_STATUS.CANCELLED) {
      throw new ValidationError('Cannot assign bidders to a finished auction');
    }
    const users = await userRepository.findManyByIds(userIds);
    if (users.length !== userIds.length) throw new ValidationError('Some userIds do not exist');
    const nonMember = users.find((u) => u.role !== ROLES.MEMBER);
    if (nonMember) throw new ValidationError(`User ${nonMember.email} is not a MEMBER`);

    const updated = await auctionRepository.update(id, { eligibleUserIds: userIds });
    return toAuctionDTO(updated);
  },

  async getMyBids(userId) {
    const ids = await bidRepository.distinctAuctionIdsForBidder(userId);
    const auctions = await Promise.all(ids.map((aid) => auctionRepository.findById(aid)));
    return auctions.filter(Boolean).map(toAuctionDTO);
  },

  async getMyWins(userId) {
    const auctions = await auctionRepository.findWinsBy(userId);
    return auctions.map(toAuctionDTO);
  },
};

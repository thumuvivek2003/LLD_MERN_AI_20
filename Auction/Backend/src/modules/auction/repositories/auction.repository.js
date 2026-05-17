import { AuctionModel } from '../models/auction.model.js';
import { AUCTION_STATUS } from '../../../shared/constants/auctionStatus.constant.js';

export const auctionRepository = {
  create(data) {
    return AuctionModel.create(data);
  },

  findById(id) {
    return AuctionModel.findById(id);
  },

  update(id, patch) {
    return AuctionModel.findByIdAndUpdate(id, patch, { new: true });
  },

  // Optimistic update — only mutates if version matches.
  // Returns the updated doc, or null on version conflict.
  updateWithVersion(id, expectedVersion, patch) {
    return AuctionModel.findOneAndUpdate(
      { _id: id, version: expectedVersion },
      { ...patch, $inc: { version: 1 } },
      { new: true },
    );
  },

  getLiveAuctions() {
    return AuctionModel.find({ status: AUCTION_STATUS.OPEN }).sort({ endTime: 1 });
  },

  list({ status, page = 1, limit = 20 } = {}) {
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    return Promise.all([
      AuctionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuctionModel.countDocuments(filter),
    ]).then(([auctions, total]) => ({ auctions, total }));
  },

  findScheduledDue(now = new Date()) {
    return AuctionModel.find({ status: AUCTION_STATUS.SCHEDULED, startTime: { $lte: now } });
  },

  findOpenExpired(now = new Date()) {
    return AuctionModel.find({ status: AUCTION_STATUS.OPEN, endTime: { $lte: now } });
  },

  findByBidder(userId) {
    return AuctionModel.find({ highestBidderId: userId }).sort({ updatedAt: -1 });
  },

  findWinsBy(userId) {
    return AuctionModel.find({ winnerId: userId, status: AUCTION_STATUS.CLOSED }).sort({ updatedAt: -1 });
  },
};

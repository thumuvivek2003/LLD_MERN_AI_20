import { BidModel } from '../models/bid.model.js';

export const bidRepository = {
  createBid(data) {
    return BidModel.create(data);
  },

  getAuctionBids(auctionId) {
    return BidModel.find({ auctionId }).sort({ timestamp: -1 });
  },

  findByBidder(userId) {
    return BidModel.find({ bidderId: userId }).sort({ timestamp: -1 });
  },

  distinctAuctionIdsForBidder(userId) {
    return BidModel.distinct('auctionId', { bidderId: userId });
  },
};

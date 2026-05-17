import { apiClient } from '../../shared/services/apiClient.js';

export const bidApi = {
  placeBid: (auctionId, amount) =>
    apiClient.post(`/api/auctions/${auctionId}/bids`, { amount }),
  getAuctionBids: (auctionId) => apiClient.get(`/api/auctions/${auctionId}/bids`),
};

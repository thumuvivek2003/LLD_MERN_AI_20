import { apiClient } from '../../shared/services/apiClient.js';

export const memberAuctionApi = {
  getLiveAuctions: () => apiClient.get('/api/auctions/live'),
  getAuctions: (params = {}) => apiClient.get('/api/auctions', { params }),
  getAuctionDetails: (id) => apiClient.get(`/api/auctions/${id}`),
  myBids: () => apiClient.get('/api/auctions/me/bids'),
  myWins: () => apiClient.get('/api/auctions/me/wins'),
};

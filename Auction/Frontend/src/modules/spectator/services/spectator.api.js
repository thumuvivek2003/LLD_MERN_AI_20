import { apiClient } from '../../shared/services/apiClient.js';

export const spectatorApi = {
  getLive: () => apiClient.get('/api/auctions/live'),
  getAuctionDetails: (id) => apiClient.get(`/api/auctions/${id}`),
};

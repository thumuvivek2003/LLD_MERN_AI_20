import { apiClient } from '../../shared/services/apiClient.js';

export const adminAuctionApi = {
  createAuction: (payload) => apiClient.post('/api/auctions', payload),
  getAuctions: (params = {}) => apiClient.get('/api/auctions', { params }),
  getAuctionById: (id) => apiClient.get(`/api/auctions/${id}`),
  closeAuction: (id) => apiClient.post(`/api/auctions/${id}/close`),
  assignBidders: (id, userIds) =>
    apiClient.post(`/api/auctions/${id}/assign`, { userIds }),
  getUsers: () => apiClient.get('/api/users'),
  getMembers: () => apiClient.get('/api/users/members'),
};

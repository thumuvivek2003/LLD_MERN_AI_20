// modules/status/services/status.api.js — all Status HTTP in one place.
// Mirrors the backend contract 1:1 (the shared API contract).
import { http } from '../../../core/api/axios.js';

export const statusApi = {
  createStatus: (payload) => http.post('/status', payload),
  getFeed: () => http.get('/status/feed'),
  getMyStatuses: () => http.get('/status/me'),
  getUserStatuses: (userId) => http.get(`/status/${userId}`),
  markViewed: (statusId) => http.post(`/status/${statusId}/view`),
  getViewers: (statusId) => http.get(`/status/${statusId}/viewers`),
  deleteStatus: (statusId) => http.delete(`/status/${statusId}`),
};

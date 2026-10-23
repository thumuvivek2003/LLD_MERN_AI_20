import { apiClient } from '../../../services/apiClient.js';

export const parkingLotApi = {
  list: () => apiClient.get('/lots'),
  get: (id) => apiClient.get(`/lots/${id}`),
  create: (payload) => apiClient.post('/admin/lots', payload),
};

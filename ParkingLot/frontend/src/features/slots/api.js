import { apiClient } from '../../services/apiClient.js';

export const slotsApi = {
  listByLot: (lotId) => apiClient.get(`/slots/lot/${lotId}`),
  add: (payload) => apiClient.post('/admin/slots', payload),
  setMaintenance: (slotId) => apiClient.patch(`/admin/slots/${slotId}/maintenance`),
};

import { apiClient } from './apiClient.js';

export const parkingService = {
  listLots: () => apiClient.get('/lots'),
  getLot: (id) => apiClient.get(`/lots/${id}`),
  createLot: (payload) => apiClient.post('/admin/lots', payload),
  addSlot: (payload) => apiClient.post('/admin/slots', payload),
  setSlotMaintenance: (slotId) => apiClient.patch(`/admin/slots/${slotId}/maintenance`),
  listSlotsByLot: (lotId) => apiClient.get(`/slots/lot/${lotId}`),
  park: (payload) => apiClient.post('/entry', payload),
  exit: (payload) => apiClient.post('/exit', payload),
};

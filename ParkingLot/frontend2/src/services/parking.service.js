import { apiClient } from './apiClient.js';

export const parkingService = {
  listLots: async () => {
    const { data } = await apiClient.get('/lots');
    return data;
  },
  getLot: async (id) => {
    const { data } = await apiClient.get(`/lots/${id}`);
    return data;
  },
  listSlotsByLot: async (lotId) => {
    const { data } = await apiClient.get(`/slots/lot/${lotId}`);
    return data;
  },
  createLot: async (payload) => {
    const { data } = await apiClient.post('/admin/lots', payload);
    return data;
  },
  createSlot: async (payload) => {
    const { data } = await apiClient.post('/admin/slots', payload);
    return data;
  },
  setSlotMaintenance: async (slotId, on) => {
    const { data } = await apiClient.patch(`/admin/slots/${slotId}/maintenance`, { on });
    return data;
  },
  parkVehicle: async ({ lotId, licensePlate, vehicleType, allocation }) => {
    const { data } = await apiClient.post('/entry', {
      lotId,
      licensePlate,
      vehicleType,
      allocation,
    });
    return data;
  },
};

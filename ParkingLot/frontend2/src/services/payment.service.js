import { apiClient } from './apiClient.js';

export const paymentService = {
  exitVehicle: async ({ ticketNumber, paymentMethod }) => {
    const { data } = await apiClient.post('/exit', { ticketNumber, paymentMethod });
    return data;
  },
};

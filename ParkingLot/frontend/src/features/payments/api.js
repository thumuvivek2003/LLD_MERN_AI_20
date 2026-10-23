import { apiClient } from '../../services/apiClient.js';

export const paymentsApi = {
  getByTicket: (ticketId) => apiClient.get(`/payments/ticket/${ticketId}`),
};

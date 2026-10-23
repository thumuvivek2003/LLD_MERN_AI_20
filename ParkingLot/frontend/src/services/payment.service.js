import { apiClient } from './apiClient.js';

export const paymentService = {
  getByTicket: (ticketId) => apiClient.get(`/payments/ticket/${ticketId}`),
};

import { apiClient } from '../../services/apiClient.js';

export const ticketsApi = {
  park: (payload) => apiClient.post('/entry', payload),
  exit: (payload) => apiClient.post('/exit', payload),
};

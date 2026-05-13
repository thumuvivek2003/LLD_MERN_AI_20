import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const rideApi = {
  request: (data) => apiClient.post(API.rides.base, data),
  myActive: () => apiClient.get(API.rides.myActive),
  myHistory: () => apiClient.get(API.rides.myHistory),
  getById: (id) => apiClient.get(API.rides.byId(id)),
  cancel: (id) => apiClient.post(API.rides.cancel(id)),
  pay: (id, method) => apiClient.post(API.payments.pay(id), { method }),
};

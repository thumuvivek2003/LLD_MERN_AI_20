import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const driverApi = {
  me: () => apiClient.get(API.drivers.me),
  setStatus: (status) => apiClient.put(API.drivers.status, { status }),
  updateLocation: (payload) => apiClient.put(API.drivers.location, payload),
  registerVehicle: (data) => apiClient.post(API.vehicles.base, data),
  myVehicles: () => apiClient.get(API.vehicles.me),
  pendingRides: () => apiClient.get(API.rides.pending),
  accept: (id) => apiClient.post(API.rides.accept(id)),
  arrive: (id) => apiClient.post(API.rides.arrive(id)),
  verifyOtp: (id, otp) => apiClient.post(API.rides.verifyOtp(id), { otp }),
  complete: (id) => apiClient.post(API.rides.complete(id)),
  cancel: (id) => apiClient.post(API.rides.cancel(id)),
  driverHistory: () => apiClient.get(API.rides.driverHistory),
};

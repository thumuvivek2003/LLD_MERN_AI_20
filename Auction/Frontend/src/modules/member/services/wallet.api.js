import { apiClient } from '../../shared/services/apiClient.js';

export const walletApi = {
  getBalance: () => apiClient.get('/api/wallet'),
  topUp: (amount) => apiClient.post('/api/wallet/topup', { amount }),
};

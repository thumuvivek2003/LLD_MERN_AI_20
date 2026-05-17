import { rateLimiterStateManager } from '../state/RateLimiterStateManager.js';

export const rateLimitRepository = {
  getClientRateLimitState(clientId) {
    return rateLimiterStateManager.getClientState(clientId);
  },

  saveClientRateLimitState(clientId, state) {
    rateLimiterStateManager.updateClientState(clientId, state);
  },

  resetClientState(clientId) {
    return rateLimiterStateManager.resetClient(clientId);
  },
};

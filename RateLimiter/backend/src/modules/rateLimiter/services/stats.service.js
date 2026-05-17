import { statsRepository } from '../repositories/stats.repository.js';

export const statsService = {
  async logRequest({ clientId, allowed, strategy, endpoint }) {
    try {
      await statsRepository.saveRequestLog({ clientId, allowed, strategy, endpoint });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[stats.logRequest] failed', err.message);
    }
  },

  incrementAllowedCount(state) {
    state.allowedCount = (state.allowedCount || 0) + 1;
  },

  incrementBlockedCount(state) {
    state.blockedCount = (state.blockedCount || 0) + 1;
  },

  async getClientStatistics(clientId) {
    return statsRepository.fetchClientStats(clientId);
  },

  async recentLogs(clientId, limit = 20) {
    return statsRepository.recentLogsByClient(clientId, limit);
  },

  async globalTotals() {
    return statsRepository.globalTotals();
  },

  async topClients(limit = 5) {
    return statsRepository.topClients(limit);
  },

  async trafficBuckets(minutes = 10) {
    return statsRepository.trafficBuckets(minutes);
  },

  async perClientCounts() {
    return statsRepository.perClientCounts();
  },

  async clearForClient(clientId) {
    return statsRepository.deleteByClient(clientId);
  },
};

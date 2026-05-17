import { RequestLogModel } from '../models/RequestLog.model.js';

export const statsRepository = {
  async saveRequestLog({ clientId, allowed, strategy, endpoint }) {
    return RequestLogModel.create({ clientId, allowed, strategy, endpoint });
  },

  async fetchClientStats(clientId) {
    const result = await RequestLogModel.aggregate([
      { $match: { clientId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          allowed: { $sum: { $cond: ['$allowed', 1, 0] } },
          blocked: { $sum: { $cond: ['$allowed', 0, 1] } },
        },
      },
    ]);
    if (result.length === 0) return { total: 0, allowed: 0, blocked: 0 };
    const { total, allowed, blocked } = result[0];
    return { total, allowed, blocked };
  },

  async recentLogsByClient(clientId, limit = 20) {
    return RequestLogModel.find({ clientId }).sort({ createdAt: -1 }).limit(limit).lean();
  },

  async globalTotals() {
    const result = await RequestLogModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          allowed: { $sum: { $cond: ['$allowed', 1, 0] } },
          blocked: { $sum: { $cond: ['$allowed', 0, 1] } },
        },
      },
    ]);
    if (result.length === 0) return { total: 0, allowed: 0, blocked: 0 };
    const { total, allowed, blocked } = result[0];
    return { total, allowed, blocked };
  },

  async topClients(limit = 5) {
    return RequestLogModel.aggregate([
      {
        $group: {
          _id: '$clientId',
          requests: { $sum: 1 },
          blocked: { $sum: { $cond: ['$allowed', 0, 1] } },
        },
      },
      { $sort: { requests: -1 } },
      { $limit: limit },
    ]);
  },

  async trafficBuckets(minutes = 10) {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    const buckets = await RequestLogModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateTrunc: { date: '$createdAt', unit: 'minute' },
          },
          allowed: { $sum: { $cond: ['$allowed', 1, 0] } },
          blocked: { $sum: { $cond: ['$allowed', 0, 1] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return buckets.map((b) => ({
      t: b._id.toISOString(),
      allowed: b.allowed,
      blocked: b.blocked,
    }));
  },

  async perClientCounts() {
    return RequestLogModel.aggregate([
      {
        $group: {
          _id: '$clientId',
          requests: { $sum: 1 },
          allowed: { $sum: { $cond: ['$allowed', 1, 0] } },
          blocked: { $sum: { $cond: ['$allowed', 0, 1] } },
        },
      },
    ]);
  },

  async deleteByClient(clientId) {
    return RequestLogModel.deleteMany({ clientId });
  },
};

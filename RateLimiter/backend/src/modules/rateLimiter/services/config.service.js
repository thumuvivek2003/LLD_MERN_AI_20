import { configRepository } from '../repositories/config.repository.js';

let cached = null;

export const configService = {
  async getCurrentConfig() {
    if (cached) return cached;
    const doc = await configRepository.getOrCreate();
    cached = serialize(doc);
    return cached;
  },

  async updateConfig(patch) {
    const doc = await configRepository.update(patch);
    cached = serialize(doc);
    return cached;
  },

  invalidate() {
    cached = null;
  },
};

function serialize(doc) {
  return {
    strategyType: doc.strategyType,
    maxRequests: doc.maxRequests,
    windowSeconds: doc.windowSeconds,
    capacity: doc.capacity,
    refillRatePerSec: doc.refillRatePerSec,
  };
}

import { ConfigModel } from '../models/Config.model.js';
import { getDefaultRateLimitConfig } from '../../../config/rateLimiter.config.js';

export const configRepository = {
  async getOrCreate() {
    let doc = await ConfigModel.findOne({ key: 'global' });
    if (!doc) {
      const defaults = getDefaultRateLimitConfig();
      doc = await ConfigModel.create({ key: 'global', ...defaults, strategyType: 'FIXED_WINDOW' });
    }
    return doc;
  },

  async update(patch) {
    const doc = await ConfigModel.findOneAndUpdate({ key: 'global' }, patch, {
      new: true,
      upsert: true,
    });
    return doc;
  },
};

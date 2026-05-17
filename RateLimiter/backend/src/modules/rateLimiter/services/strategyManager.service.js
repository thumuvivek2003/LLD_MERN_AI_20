import { strategyRegistry } from '../singleton/strategyRegistry.singleton.js';
import { configService } from './config.service.js';
import { STRATEGY_CATALOG, STRATEGY_TYPES } from '../constants/strategyTypes.js';
import { AppError } from '../../../shared/exceptions/AppError.js';

export const strategyManagerService = {
  getActiveStrategy() {
    return strategyRegistry.getStrategy();
  },

  getActiveType() {
    return strategyRegistry.getActiveType();
  },

  async switchStrategy(type) {
    if (!Object.values(STRATEGY_TYPES).includes(type)) {
      throw new AppError(`Unknown strategy type: ${type}`, 400, 'UNKNOWN_STRATEGY');
    }
    strategyRegistry.registerStrategy(type);
    await configService.updateConfig({ strategyType: type });
    return strategyRegistry.getActiveType();
  },

  catalog() {
    return STRATEGY_CATALOG;
  },

  async hydrateFromConfig() {
    const cfg = await configService.getCurrentConfig();
    strategyRegistry.registerStrategy(cfg.strategyType);
    return cfg.strategyType;
  },
};

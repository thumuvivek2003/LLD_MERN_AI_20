import { createStrategy } from '../factories/strategy.factory.js';
import { STRATEGY_TYPES } from '../constants/strategyTypes.js';

class StrategyRegistry {
  constructor() {
    this.activeType = STRATEGY_TYPES.FIXED_WINDOW;
    this.strategy = createStrategy(this.activeType);
  }

  registerStrategy(type) {
    this.strategy = createStrategy(type);
    this.activeType = type;
    return this.strategy;
  }

  getStrategy() {
    return this.strategy;
  }

  getActiveType() {
    return this.activeType;
  }
}

const instance = new StrategyRegistry();

export function getInstance() {
  return instance;
}

export const strategyRegistry = instance;

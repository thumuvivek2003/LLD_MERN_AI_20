import { WeekdayPricingStrategy } from '../strategies/pricing/WeekdayPricingStrategy.js';
import { WeekendPricingStrategy } from '../strategies/pricing/WeekendPricingStrategy.js';
import { FlatPricingStrategy } from '../strategies/pricing/FlatPricingStrategy.js';
import { NearestSlotStrategy } from '../strategies/allocation/NearestSlotStrategy.js';
import { FirstAvailableStrategy } from '../strategies/allocation/FirstAvailableStrategy.js';
import { RandomSlotStrategy } from '../strategies/allocation/RandomSlotStrategy.js';

export class StrategyFactory {
  static pricing(date = new Date()) {
    const day = date.getDay();
    if (day === 0 || day === 6) return new WeekendPricingStrategy();
    return new WeekdayPricingStrategy();
  }

  static flatPricing() {
    return new FlatPricingStrategy();
  }

  static allocation(name, slotRepository) {
    switch (name) {
      case 'NEAREST': return new NearestSlotStrategy(slotRepository);
      case 'RANDOM': return new RandomSlotStrategy(slotRepository);
      case 'FIRST':
      default: return new FirstAvailableStrategy(slotRepository);
    }
  }
}

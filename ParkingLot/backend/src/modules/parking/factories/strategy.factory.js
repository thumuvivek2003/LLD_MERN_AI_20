import { FlatPricingStrategy } from '../strategies/pricing/flat-pricing.strategy.js';
import { HourlyPricingStrategy } from '../strategies/pricing/hourly-pricing.strategy.js';
import { WeekdayPricingStrategy } from '../strategies/pricing/weekday-pricing.strategy.js';
import { WeekendPricingStrategy } from '../strategies/pricing/weekend-pricing.strategy.js';
import { NearestSlotStrategy } from '../strategies/allocation/nearest-slot.strategy.js';
import { RandomSlotStrategy } from '../strategies/allocation/random-slot.strategy.js';
import { FirstAvailableStrategy } from '../strategies/allocation/first-available.strategy.js';
import { ValidationError } from '../../../shared/exceptions/validation-error.js';

const PRICING = {
  FLAT: FlatPricingStrategy,
  HOURLY: HourlyPricingStrategy,
  WEEKDAY: WeekdayPricingStrategy,
  WEEKEND: WeekendPricingStrategy,
};

const ALLOCATION = {
  NEAREST: NearestSlotStrategy,
  RANDOM: RandomSlotStrategy,
  FIRST_AVAILABLE: FirstAvailableStrategy,
};

export const StrategyFactory = {
  pricing(name) {
    const Strategy = PRICING[name];
    if (!Strategy) throw new ValidationError(`Unknown pricing strategy: ${name}`);
    return new Strategy();
  },
  allocation(name) {
    const Strategy = ALLOCATION[name];
    if (!Strategy) throw new ValidationError(`Unknown allocation strategy: ${name}`);
    return new Strategy();
  },
  pricingNames: () => Object.keys(PRICING),
  allocationNames: () => Object.keys(ALLOCATION),
};

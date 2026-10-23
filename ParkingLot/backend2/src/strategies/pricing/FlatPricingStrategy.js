import { PricingStrategy } from './PricingStrategy.js';
import { PRICING } from '../../config/constants.js';

export class FlatPricingStrategy extends PricingStrategy {
  calculate() {
    return PRICING.FLAT_DAY;
  }
}

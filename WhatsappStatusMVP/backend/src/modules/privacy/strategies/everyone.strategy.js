// modules/privacy/strategies/everyone.strategy.js
import { PrivacyStrategy } from './privacy.strategy.js';

// "Everyone": any friend who receives the status may view it.
export class EveryoneStrategy extends PrivacyStrategy {
  canView() {
    return true;
  }
}

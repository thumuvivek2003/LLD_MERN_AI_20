// modules/privacy/strategies/onlyShare.strategy.js
import { PrivacyStrategy } from './privacy.strategy.js';

// "Only share with…": ONLY the included users may view.
export class OnlyShareStrategy extends PrivacyStrategy {
  canView(status, viewerId) {
    const included = (status.includeUsers || []).map(String);
    return included.includes(String(viewerId));
  }
}

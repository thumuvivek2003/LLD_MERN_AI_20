// modules/privacy/strategies/exclude.strategy.js
import { PrivacyStrategy } from './privacy.strategy.js';

// "My contacts except…": everyone can view EXCEPT the excluded users.
export class ExcludeStrategy extends PrivacyStrategy {
  canView(status, viewerId) {
    const excluded = (status.excludeUsers || []).map(String);
    return !excluded.includes(String(viewerId));
  }
}

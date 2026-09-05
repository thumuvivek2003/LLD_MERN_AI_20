// modules/privacy/privacy.service.js — canViewStatus()
// Single responsibility: given a status + viewer, decide visibility by
// delegating to the right Strategy (chosen by the Factory).
import { createStrategy } from './privacy.factory.js';

class PrivacyService {
  canViewStatus(status, viewerId) {
    // Owner can always see their own status.
    if (String(status.ownerId) === String(viewerId)) return true;
    const strategy = createStrategy(status.privacy);
    return strategy.canView(status, viewerId);
  }

  filterVisible(statuses, viewerId) {
    return statuses.filter((s) => this.canViewStatus(s, viewerId));
  }
}

export const privacyService = new PrivacyService();

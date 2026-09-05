// modules/view/view.service.js — markViewed(), getSeenMap()
// ViewService answers: "has the viewer already seen this status?" and records
// new views (idempotently), then publishes a live event to the owner.
import { viewRepository } from './view.repository.js';
import { statusRepository } from '../status/status.repository.js';
import { privacyService } from '../privacy/privacy.service.js';
import { socketPublisher } from '../../core/socket/socket.publisher.js';
import { NotFoundError } from '../../core/errors/notFound.error.js';
import { ForbiddenError } from '../../core/errors/validation.error.js';
import { isExpired } from '../../core/utils/date.util.js';

class ViewService {
  async markViewed(statusId, viewerId) {
    const status = await statusRepository.findById(statusId);
    if (!status || isExpired(status.expiresAt)) throw new NotFoundError('Status not found or expired');

    // A viewer may only mark-viewed a status they are actually allowed to see.
    if (!privacyService.canViewStatus(status, viewerId)) {
      throw new ForbiddenError('You cannot view this status');
    }

    // Owner viewing own status should not count as a "viewer".
    if (String(status.ownerId) !== String(viewerId)) {
      await viewRepository.recordView(statusId, viewerId);
      socketPublisher.publishStatusViewed({
        ownerId: status.ownerId,
        statusId,
        viewerId,
      });
    }
    return { ok: true };
  }

  // Returns a Set of seen statusIds for quick lookups while building the feed.
  async getSeenMap(viewerId, statusIds) {
    const seen = await viewRepository.findSeenStatusIds(viewerId, statusIds);
    return new Set(seen);
  }
}

export const viewService = new ViewService();

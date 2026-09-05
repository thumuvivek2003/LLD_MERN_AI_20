// core/feed/feed.service.js — buildFeed(), groupStatuses(), sortFeed()
// Pure feed-shaping logic. Takes already-fetched (privacy-filtered) statuses +
// a seen-set + a user lookup, and produces the grouped, ordered feed.
// No DB access here — keeps it testable and single-responsibility.
import { orderingService } from './ordering.service.js';

class FeedService {
  // Group flat statuses by ownerId, compute seen/unseen counts + latest time.
  groupStatuses(statuses, seenSet, userMap) {
    const byOwner = new Map();

    for (const s of statuses) {
      const ownerId = String(s.ownerId);
      if (!byOwner.has(ownerId)) {
        byOwner.set(ownerId, {
          user: userMap.get(ownerId) || { id: ownerId, name: 'Unknown', avatar: '' },
          statuses: [],
          unseenCount: 0,
          seenCount: 0,
          latestStatusAt: s.createdAt,
        });
      }
      const group = byOwner.get(ownerId);
      const seen = seenSet.has(String(s._id));
      group.statuses.push({ ...s, seen });
      if (seen) group.seenCount += 1;
      else group.unseenCount += 1;
      if (new Date(s.createdAt) > new Date(group.latestStatusAt)) {
        group.latestStatusAt = s.createdAt;
      }
    }

    return [...byOwner.values()];
  }

  sortFeed(groups) {
    return orderingService.orderUsers(groups);
  }

  buildFeed(statuses, seenSet, userMap) {
    const groups = this.groupStatuses(statuses, seenSet, userMap);
    return this.sortFeed(groups);
  }
}

export const feedService = new FeedService();

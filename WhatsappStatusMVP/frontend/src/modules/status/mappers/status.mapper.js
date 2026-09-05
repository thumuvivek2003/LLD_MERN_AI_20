// modules/status/mappers/status.mapper.js — Mapper pattern.
// Turns backend DTOs into UI-friendly view models before rendering, and splits
// the feed into the two visual sections WhatsApp shows.
import { timeAgo } from '../../../core/utils/date.util.js';

export function toFeedModel(group) {
  return {
    user: group.user,
    hasUnseen: group.hasUnseen,
    unseenCount: group.unseenCount,
    seenCount: group.seenCount,
    total: group.statuses.length,
    timeLabel: timeAgo(group.latestStatusAt),
    latestStatusAt: group.latestStatusAt,
  };
}

// Partition the ordered feed into "Recent updates" (unseen) and "Viewed" groups
// — the backend already sorted them, we only slice by state for the headings.
export function toFeedSections(feed) {
  const models = feed.map(toFeedModel);
  return {
    recent: models.filter((m) => m.hasUnseen),
    viewed: models.filter((m) => !m.hasUnseen),
  };
}

export function toViewerModel(viewer) {
  return {
    id: viewer.id,
    name: viewer.name,
    avatar: viewer.avatar,
    timeLabel: timeAgo(viewer.viewedAt),
  };
}

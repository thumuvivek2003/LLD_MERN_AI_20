// modules/status/status.mapper.js — toFeedResponse(), toStatusResponse()
// Converts internal documents into the exact API contract the frontend consumes.

// A single status inside a viewer's drill-down (only id + seen + render data).
export function toStatusResponse(status, { seen = false } = {}) {
  return {
    id: String(status._id),
    text: status.text,
    background: status.background,
    createdAt: status.createdAt,
    seen,
  };
}

// A status the owner sees about their own post (with a viewer count).
export function toOwnStatusResponse(status, { viewersCount = 0 } = {}) {
  return {
    id: String(status._id),
    text: status.text,
    background: status.background,
    privacy: status.privacy,
    createdAt: status.createdAt,
    expiresAt: status.expiresAt,
    viewersCount,
  };
}

// One entry in the grouped home feed (one row per friend).
export function toFeedResponse(group) {
  return {
    user: group.user,
    unseenCount: group.unseenCount,
    seenCount: group.seenCount,
    hasUnseen: group.unseenCount > 0,
    latestStatusAt: group.latestStatusAt,
    statuses: group.statuses.map((s) => ({ id: String(s._id), seen: s.seen })),
  };
}

import { MESSAGE_STATUS } from '../constants/socket.constant.js';

const RANK = {
  [MESSAGE_STATUS.SENT]: 1,
  [MESSAGE_STATUS.DELIVERED]: 2,
  [MESSAGE_STATUS.READ]: 3,
};

/**
 * Resolve an aggregated message status from a list of per-recipient statuses.
 * Returns the LOWEST of the recipient statuses (excludes the sender).
 */
export function resolveMessageStatus(statuses = [], senderId) {
  const recipients = statuses.filter((s) => s.userId !== senderId);
  if (recipients.length === 0) return MESSAGE_STATUS.SENT;
  let lowest = MESSAGE_STATUS.READ;
  for (const s of recipients) {
    if ((RANK[s.status] ?? 0) < (RANK[lowest] ?? 0)) {
      lowest = s.status;
    }
  }
  return lowest;
}

export function compareStatus(a, b) {
  return (RANK[a] ?? 0) - (RANK[b] ?? 0);
}

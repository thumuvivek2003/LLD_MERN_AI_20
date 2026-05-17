export const MESSAGE_STATUS = Object.freeze({
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
});

const RANKS = { SENT: 0, DELIVERED: 1, READ: 2 };

/**
 * Used for "lowest status across recipients" aggregation in group chats.
 */
export function statusRank(status) {
  return RANKS[status] ?? 0;
}

/**
 * State-pattern friendly check: should we move from current -> next?
 */
export function isForwardTransition(current, next) {
  return statusRank(next) > statusRank(current);
}

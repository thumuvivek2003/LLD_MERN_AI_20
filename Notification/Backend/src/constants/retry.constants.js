/**
 * Retry policy constants. delay = BASE_DELAY_MS * 2^(attempt-1).
 * After MAX_ATTEMPTS the notification is parked in DEAD (dead letter).
 */
export const RETRY = Object.freeze({
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 5_000,
});

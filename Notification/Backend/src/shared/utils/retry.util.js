import { RETRY } from '../../constants/retry.constants.js';

/**
 * Exponential backoff in milliseconds.
 * attempt is 1-indexed (attempt #1 is the first retry, not the original send).
 *   attempt 1 → 5s
 *   attempt 2 → 10s
 *   attempt 3 → 20s
 */
export function calculateExponentialBackoff(attempt, baseMs = RETRY.BASE_DELAY_MS) {
  const safeAttempt = Math.max(1, attempt | 0);
  return baseMs * 2 ** (safeAttempt - 1);
}

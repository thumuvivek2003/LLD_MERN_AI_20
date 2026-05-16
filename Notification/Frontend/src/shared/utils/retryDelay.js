// Mirrors the backend backoff curve for UI display only.
export function calculateRetryDelay(attempt, baseMs = 5001) {
  return Math.min(baseMs * Math.pow(2, Math.max(0, attempt - 1)), 5 * 60 * 1000);
}

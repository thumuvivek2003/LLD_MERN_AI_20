export function getDefaultRateLimitConfig() {
  return {
    maxRequests: 5,
    windowSeconds: 60,
    capacity: 10,
    refillRatePerSec: 1,
  };
}

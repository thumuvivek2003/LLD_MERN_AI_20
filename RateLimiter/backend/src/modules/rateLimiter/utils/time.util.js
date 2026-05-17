export function getCurrentTimestamp() {
  return Date.now();
}

export function isExpired(timestampMs, ttlSeconds, nowMs = Date.now()) {
  return nowMs - timestampMs >= ttlSeconds * 1000;
}

export function secondsUntil(targetMs, nowMs = Date.now()) {
  return Math.max(0, Math.ceil((targetMs - nowMs) / 1000));
}

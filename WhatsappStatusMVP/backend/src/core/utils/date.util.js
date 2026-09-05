// core/utils/date.util.js
import { env } from '../../config/env.js';

export function now() {
  return new Date();
}

export function isExpired(expiresAt) {
  return new Date(expiresAt).getTime() <= Date.now();
}

// A status lives for statusTtlHours (24h) from creation.
export function computeExpiry(from = now()) {
  return new Date(from.getTime() + env.statusTtlHours * 60 * 60 * 1000);
}

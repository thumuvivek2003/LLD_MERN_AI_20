import { rateLimiterStateManager } from '../state/RateLimiterStateManager.js';
import { configService } from './config.service.js';

const CLEANUP_INTERVAL_MS = 30_000;
const IDLE_TTL_MS = 10 * 60 * 1000;

let timer = null;

async function cleanupExpiredWindows() {
  try {
    const cfg = await configService.getCurrentConfig();
    const windowMs = (cfg.windowSeconds || 60) * 1000;
    const now = Date.now();
    for (const [, state] of rateLimiterStateManager.allEntries()) {
      if (state.windowStart && now - state.windowStart >= windowMs) {
        state.windowStart = 0;
        state.requestCount = 0;
      }
      if (state.timestamps && state.timestamps.length > 0) {
        const cutoff = now - windowMs;
        state.timestamps = state.timestamps.filter((t) => t > cutoff);
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[cleanup.expiredWindows] failed', err.message);
  }
}

function cleanupUnusedClients() {
  const now = Date.now();
  for (const [clientId, state] of rateLimiterStateManager.allEntries()) {
    const lastTouch = Math.max(state.windowStart || 0, state.lastRefill || 0);
    const lastTs = state.timestamps?.length ? state.timestamps[state.timestamps.length - 1] : 0;
    const lastActive = Math.max(lastTouch, lastTs);
    if (lastActive > 0 && now - lastActive > IDLE_TTL_MS) {
      rateLimiterStateManager.removeClient(clientId);
    }
  }
}

export function startCleanupService() {
  if (timer) return timer;
  timer = setInterval(async () => {
    await cleanupExpiredWindows();
    cleanupUnusedClients();
  }, CLEANUP_INTERVAL_MS);
  timer.unref?.();
  return timer;
}

export function stopCleanupService() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export const cleanupService = {
  start: startCleanupService,
  stop: stopCleanupService,
  cleanupExpiredWindows,
  cleanupUnusedClients,
};

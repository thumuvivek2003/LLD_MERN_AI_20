import { IRateLimiterStrategy } from './interfaces/IRateLimiterStrategy.js';
import { STRATEGY_TYPES } from '../constants/strategyTypes.js';

export class SlidingWindowStrategy extends IRateLimiterStrategy {
  get type() {
    return STRATEGY_TYPES.SLIDING_WINDOW;
  }

  removeExpiredTimestamps(timestamps, cutoffMs) {
    let i = 0;
    while (i < timestamps.length && timestamps[i] <= cutoffMs) i += 1;
    return i === 0 ? timestamps : timestamps.slice(i);
  }

  allowRequest(context, state, config) {
    const now = context.timestamp;
    const windowMs = config.windowSeconds * 1000;
    const max = config.maxRequests;
    const cutoff = now - windowMs;

    state.timestamps = this.removeExpiredTimestamps(state.timestamps, cutoff);

    if (state.timestamps.length >= max) {
      const oldest = state.timestamps[0];
      const resetAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return {
        allowed: false,
        remainingTokens: 0,
        resetAfterSeconds,
        newState: state,
      };
    }

    state.timestamps.push(now);
    const oldest = state.timestamps[0];
    const resetAfterSeconds = Math.max(0, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: true,
      remainingTokens: max - state.timestamps.length,
      resetAfterSeconds,
      newState: state,
    };
  }
}

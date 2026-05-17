import { IRateLimiterStrategy } from './interfaces/IRateLimiterStrategy.js';
import { STRATEGY_TYPES } from '../constants/strategyTypes.js';

export class FixedWindowStrategy extends IRateLimiterStrategy {
  get type() {
    return STRATEGY_TYPES.FIXED_WINDOW;
  }

  calculateResetTime(windowStart, windowMs) {
    return windowStart + windowMs;
  }

  allowRequest(context, state, config) {
    const now = context.timestamp;
    const windowMs = config.windowSeconds * 1000;
    const max = config.maxRequests;

    if (state.windowStart === 0 || now - state.windowStart >= windowMs) {
      state.windowStart = now;
      state.requestCount = 0;
    }

    const resetAt = this.calculateResetTime(state.windowStart, windowMs);
    const resetAfterSeconds = Math.max(0, Math.ceil((resetAt - now) / 1000));

    if (state.requestCount >= max) {
      return {
        allowed: false,
        remainingTokens: 0,
        resetAfterSeconds,
        newState: state,
      };
    }

    state.requestCount += 1;
    return {
      allowed: true,
      remainingTokens: max - state.requestCount,
      resetAfterSeconds,
      newState: state,
    };
  }
}

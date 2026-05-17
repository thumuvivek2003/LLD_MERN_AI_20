import { IRateLimiterStrategy } from './interfaces/IRateLimiterStrategy.js';
import { STRATEGY_TYPES } from '../constants/strategyTypes.js';

export class TokenBucketStrategy extends IRateLimiterStrategy {
  get type() {
    return STRATEGY_TYPES.TOKEN_BUCKET;
  }

  refillTokens(state, config, now) {
    const capacity = config.capacity;
    const rate = config.refillRatePerSec;

    if (state.lastRefill === 0) {
      state.tokens = capacity;
      state.lastRefill = now;
      return;
    }

    const elapsedMs = now - state.lastRefill;
    if (elapsedMs <= 0) return;

    const tokensToAdd = (elapsedMs / 1000) * rate;
    state.tokens = Math.min(capacity, state.tokens + tokensToAdd);
    state.lastRefill = now;
  }

  allowRequest(context, state, config) {
    const now = context.timestamp;
    this.refillTokens(state, config, now);

    const rate = config.refillRatePerSec || 1;

    if (state.tokens >= 1) {
      state.tokens -= 1;
      const remaining = Math.floor(state.tokens);
      const resetAfterSeconds = Math.max(0, Math.ceil((config.capacity - state.tokens) / rate));
      return {
        allowed: true,
        remainingTokens: remaining,
        resetAfterSeconds,
        newState: state,
      };
    }

    const needed = 1 - state.tokens;
    const resetAfterSeconds = Math.max(1, Math.ceil(needed / rate));
    return {
      allowed: false,
      remainingTokens: 0,
      resetAfterSeconds,
      newState: state,
    };
  }
}

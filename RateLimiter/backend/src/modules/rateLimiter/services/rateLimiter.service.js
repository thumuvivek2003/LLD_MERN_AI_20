import { strategyManagerService } from './strategyManager.service.js';
import { configService } from './config.service.js';
import { statsService } from './stats.service.js';
import { rateLimitRepository } from '../repositories/rateLimit.repository.js';
import { buildRateLimitResponse } from '../dto/RateLimitResponse.dto.js';
import { clientRepository } from '../repositories/client.repository.js';
import { RateLimitExceededError } from '../../../shared/exceptions/RateLimitExceededError.js';

export const rateLimiterService = {
  async processRequest(context) {
    const config = await configService.getCurrentConfig();
    const strategy = strategyManagerService.getActiveStrategy();
    const state = rateLimitRepository.getClientRateLimitState(context.clientId);

    const { allowed, remainingTokens, resetAfterSeconds, newState } = strategy.allowRequest(
      context,
      state,
      config,
    );

    if (allowed) statsService.incrementAllowedCount(newState);
    else statsService.incrementBlockedCount(newState);

    rateLimitRepository.saveClientRateLimitState(context.clientId, newState);

    await statsService.logRequest({
      clientId: context.clientId,
      allowed,
      strategy: strategy.type,
      endpoint: context.endpoint,
    });

    clientRepository.touchLastSeen(context.clientId).catch(() => {});

    return buildRateLimitResponse({
      allowed,
      remainingTokens,
      resetAfterSeconds,
      strategy: strategy.type,
      message: allowed ? undefined : 'Rate limit exceeded',
    });
  },

  async peekUsage(clientId) {
    const config = await configService.getCurrentConfig();
    const strategy = strategyManagerService.getActiveStrategy();
    const state = rateLimitRepository.getClientRateLimitState(clientId);

    return computeRemaining(state, strategy.type, config);
  },
};

export function computeRemaining(state, strategyType, config) {
  const now = Date.now();
  if (strategyType === 'FIXED_WINDOW') {
    const windowMs = config.windowSeconds * 1000;
    const fresh = !state.windowStart || now - state.windowStart >= windowMs;
    const remaining = fresh ? config.maxRequests : Math.max(0, config.maxRequests - state.requestCount);
    const resetAt = fresh ? now + windowMs : state.windowStart + windowMs;
    return {
      remainingTokens: remaining,
      resetAfterSeconds: Math.max(0, Math.ceil((resetAt - now) / 1000)),
    };
  }
  if (strategyType === 'SLIDING_WINDOW') {
    const windowMs = config.windowSeconds * 1000;
    const cutoff = now - windowMs;
    const live = (state.timestamps || []).filter((t) => t > cutoff);
    const remaining = Math.max(0, config.maxRequests - live.length);
    const oldest = live[0] || now;
    return {
      remainingTokens: remaining,
      resetAfterSeconds: Math.max(0, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }
  // TOKEN_BUCKET
  const rate = config.refillRatePerSec || 1;
  let tokens = state.tokens;
  if (state.lastRefill === 0) tokens = config.capacity;
  else {
    const elapsed = (now - state.lastRefill) / 1000;
    tokens = Math.min(config.capacity, tokens + elapsed * rate);
  }
  return {
    remainingTokens: Math.floor(tokens),
    resetAfterSeconds: Math.max(0, Math.ceil((config.capacity - tokens) / rate)),
  };
}

export { RateLimitExceededError };

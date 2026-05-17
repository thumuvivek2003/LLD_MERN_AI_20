import { rateLimiterService } from '../services/rateLimiter.service.js';
import { configService } from '../services/config.service.js';
import { strategyManagerService } from '../services/strategyManager.service.js';
import { statsService } from '../services/stats.service.js';
import { rateLimitRepository } from '../repositories/rateLimit.repository.js';
import { authRepository } from '../../auth/auth.repository.js';

export const rateLimiterController = {
  async allowRequest(req, res, next) {
    try {
      const clientId = req.client.clientId;
      const endpoint = (req.body && req.body.endpoint) || '/';
      const response = await rateLimiterService.processRequest({ clientId, endpoint, timestamp: Date.now() });
      const status = response.allowed ? 200 : 429;
      return res.status(status).json(response);
    } catch (err) {
      return next(err);
    }
  },

  async getClientUsage(req, res, next) {
    try {
      const userId = req.user.sub;
      const client = await authRepository.findById(userId);
      if (!client) return res.status(404).json({ error: { message: 'Client not found' } });

      const stats = await statsService.getClientStatistics(client.clientId);
      const recent = await statsService.recentLogs(client.clientId, 20);
      const peek = await rateLimiterService.peekUsage(client.clientId);

      return res.status(200).json({
        clientId: client.clientId,
        username: client.username,
        allowed: stats.allowed,
        blocked: stats.blocked,
        remainingTokens: peek.remainingTokens,
        resetAfterSeconds: peek.resetAfterSeconds,
        strategy: strategyManagerService.getActiveType(),
        recentLogs: recent.map((r) => ({
          at: r.createdAt,
          endpoint: r.endpoint,
          allowed: r.allowed,
        })),
      });
    } catch (err) {
      return next(err);
    }
  },

  async getCurrentStrategy(_req, res, next) {
    try {
      const config = await configService.getCurrentConfig();
      return res.status(200).json({
        strategyType: strategyManagerService.getActiveType(),
        config: {
          maxRequests: config.maxRequests,
          windowSeconds: config.windowSeconds,
          capacity: config.capacity,
          refillRatePerSec: config.refillRatePerSec,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
};

export { rateLimitRepository };

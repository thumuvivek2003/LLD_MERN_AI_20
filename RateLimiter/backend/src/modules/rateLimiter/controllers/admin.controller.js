import { strategyManagerService } from '../services/strategyManager.service.js';
import { configService } from '../services/config.service.js';
import { statsService } from '../services/stats.service.js';
import { clientRepository } from '../repositories/client.repository.js';
import { rateLimitRepository } from '../repositories/rateLimit.repository.js';
import { authService } from '../../auth/auth.service.js';
import { validateRegisterPayload } from '../../auth/auth.validation.js';
import { AppError } from '../../../shared/exceptions/AppError.js';

export const adminController = {
  async getDashboard(_req, res, next) {
    try {
      const [totals, topClients, traffic, allClients] = await Promise.all([
        statsService.globalTotals(),
        statsService.topClients(5),
        statsService.trafficBuckets(10),
        clientRepository.listClients(),
      ]);

      const usernameMap = new Map(allClients.map((c) => [c.clientId, c.username]));
      const activeCutoff = Date.now() - 5 * 60 * 1000;
      const activeClients = allClients.filter(
        (c) => c.lastSeen && new Date(c.lastSeen).getTime() >= activeCutoff,
      ).length;

      return res.status(200).json({
        totalRequests: totals.total,
        totalAllowed: totals.allowed,
        totalBlocked: totals.blocked,
        activeClients,
        currentStrategy: strategyManagerService.getActiveType(),
        traffic,
        topClients: topClients.map((c) => ({
          clientId: c._id,
          username: usernameMap.get(c._id) || c._id,
          requests: c.requests,
          blocked: c.blocked,
        })),
      });
    } catch (err) {
      return next(err);
    }
  },

  async listStrategies(_req, res, next) {
    try {
      return res.status(200).json({
        active: strategyManagerService.getActiveType(),
        available: strategyManagerService.catalog(),
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateStrategy(req, res, next) {
    try {
      const { strategyType } = req.body || {};
      if (!strategyType) throw new AppError('strategyType is required', 400, 'VALIDATION_ERROR');
      const active = await strategyManagerService.switchStrategy(strategyType);
      return res.status(200).json({ active });
    } catch (err) {
      return next(err);
    }
  },

  async getConfig(_req, res, next) {
    try {
      const cfg = await configService.getCurrentConfig();
      return res.status(200).json({
        maxRequests: cfg.maxRequests,
        windowSeconds: cfg.windowSeconds,
        capacity: cfg.capacity,
        refillRatePerSec: cfg.refillRatePerSec,
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateLimitConfig(req, res, next) {
    try {
      const allowed = ['maxRequests', 'windowSeconds', 'capacity', 'refillRatePerSec'];
      const patch = {};
      for (const k of allowed) {
        if (req.body[k] !== undefined) {
          const v = Number(req.body[k]);
          if (!Number.isFinite(v) || v <= 0) {
            throw new AppError(`${k} must be a positive number`, 400, 'VALIDATION_ERROR');
          }
          patch[k] = v;
        }
      }
      const merged = await configService.updateConfig(patch);
      return res.status(200).json({
        maxRequests: merged.maxRequests,
        windowSeconds: merged.windowSeconds,
        capacity: merged.capacity,
        refillRatePerSec: merged.refillRatePerSec,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getAllClientStats(_req, res, next) {
    try {
      const [clients, counts] = await Promise.all([
        clientRepository.listClients(),
        statsService.perClientCounts(),
      ]);
      const countMap = new Map(counts.map((c) => [c._id, c]));
      const rows = clients.map((c) => {
        const stats = countMap.get(c.clientId) || { requests: 0, allowed: 0, blocked: 0 };
        return {
          _id: c._id,
          clientId: c.clientId,
          username: c.username,
          status: c.status,
          requests: stats.requests,
          allowed: stats.allowed,
          blocked: stats.blocked,
          lastSeen: c.lastSeen,
        };
      });
      return res.status(200).json(rows);
    } catch (err) {
      return next(err);
    }
  },

  async getClientDetails(req, res, next) {
    try {
      const { clientId } = req.params;
      const client = await clientRepository.findByClientId(clientId);
      if (!client) throw new AppError('Client not found', 404, 'NOT_FOUND');
      const [stats, history] = await Promise.all([
        statsService.getClientStatistics(clientId),
        statsService.recentLogs(clientId, 50),
      ]);
      return res.status(200).json({
        client: {
          _id: client._id,
          clientId: client.clientId,
          username: client.username,
          status: client.status,
          lastSeen: client.lastSeen,
        },
        stats: { allowed: stats.allowed, blocked: stats.blocked, requests: stats.total },
        history: history.map((h) => ({ at: h.createdAt, allowed: h.allowed, endpoint: h.endpoint })),
      });
    } catch (err) {
      return next(err);
    }
  },

  async createClient(req, res, next) {
    try {
      const { username, password } = validateRegisterPayload(req.body);
      const result = await authService.register({ username, password, role: 'client' });
      return res.status(201).json({ client: result.user });
    } catch (err) {
      return next(err);
    }
  },

  async resetClientCounters(req, res, next) {
    try {
      const { clientId } = req.params;
      const client = await clientRepository.findByClientId(clientId);
      if (!client) throw new AppError('Client not found', 404, 'NOT_FOUND');
      rateLimitRepository.resetClientState(clientId);
      await statsService.clearForClient(clientId);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },

  async blockClient(req, res, next) {
    try {
      const { clientId } = req.params;
      const updated = await clientRepository.updateStatus(clientId, 'blocked');
      if (!updated) throw new AppError('Client not found', 404, 'NOT_FOUND');
      return res.status(200).json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },

  async unblockClient(req, res, next) {
    try {
      const { clientId } = req.params;
      const updated = await clientRepository.updateStatus(clientId, 'active');
      if (!updated) throw new AppError('Client not found', 404, 'NOT_FOUND');
      return res.status(200).json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
};

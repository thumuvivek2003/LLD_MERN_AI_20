import { systemService } from '../services/system.service.js';
import { ok } from '../../../shared/utils/response.util.js';

export const systemController = {
  getQueue(_req, res, next) {
    try {
      return ok(res, systemService.getQueueSnapshot());
    } catch (err) {
      next(err);
    }
  },
  getRetryQueue(_req, res, next) {
    try {
      return ok(res, systemService.getRetryQueueSnapshot());
    } catch (err) {
      next(err);
    }
  },
  getLogs(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
      return ok(res, systemService.getLogs(limit));
    } catch (err) {
      next(err);
    }
  },
};

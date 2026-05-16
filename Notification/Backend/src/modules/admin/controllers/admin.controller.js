import { adminDashboardService } from '../services/adminDashboard.service.js';
import { notificationRepository } from '../../notification/repositories/notification.repository.js';
import { retryService } from '../../notification/services/retry.service.js';
import { logger } from '../../../shared/logger/logger.js';
import { ok } from '../../../shared/utils/response.util.js';

export const adminController = {
  async getDashboard(_req, res, next) {
    try {
      const metrics = await adminDashboardService.getDashboardMetrics();
      return ok(res, metrics);
    } catch (err) {
      next(err);
    }
  },

  async retryFailedNotifications(_req, res, next) {
    try {
      const failed = await notificationRepository.findFailedNotifications(50);
      let scheduled = 0;
      for (const n of failed) {
        try {
          await retryService.retryFailedNotification(n._id, { manual: true });
          scheduled += 1;
        } catch (err) {
          logger.warn('admin.retry.skip', { id: n._id, err: err.message });
        }
      }
      return ok(res, { scheduled });
    } catch (err) {
      next(err);
    }
  },

  async getSystemStats(_req, res, next) {
    try {
      const stats = await adminDashboardService.getSystemStats();
      return ok(res, stats);
    } catch (err) {
      next(err);
    }
  },
};

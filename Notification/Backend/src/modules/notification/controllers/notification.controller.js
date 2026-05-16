import { notificationOrchestratorService } from '../services/notificationOrchestrator.service.js';
import { notificationQueryService } from '../services/notificationQuery.service.js';
import { notificationService } from '../services/notification.service.js';
import { buildTriggerDto, buildSendDto, buildSendGroupDto } from '../dto/createNotification.dto.js';
import { buildRetryDto } from '../dto/retryNotification.dto.js';
import { ok } from '../../../shared/utils/response.util.js';

export const notificationController = {
  async triggerNotification(req, res, next) {
    try {
      const dto = buildTriggerDto(req.body);
      const result = await notificationOrchestratorService.handleEventNotificationFlow(dto);
      return ok(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async sendNotification(req, res, next) {
    try {
      const dto = buildSendDto(req.body);
      const result = await notificationOrchestratorService.handleAdminSend(dto);
      return ok(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async sendGroupNotification(req, res, next) {
    try {
      const dto = buildSendGroupDto(req.body);
      const result = await notificationOrchestratorService.handleGroupSend(dto);
      return ok(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async getNotifications(req, res, next) {
    try {
      const result = await notificationQueryService.getNotifications(req.query || {});
      return ok(res, result);
    } catch (err) {
      next(err);
    }
  },

  async getNotificationById(req, res, next) {
    try {
      const item = await notificationQueryService.getNotificationById(req.params.id);
      return ok(res, item);
    } catch (err) {
      next(err);
    }
  },

  async retryNotification(req, res, next) {
    try {
      const { id } = buildRetryDto(req.params);
      const result = await notificationService.retryNotification(id, { manual: true });
      return ok(res, {
        id,
        retryCount: result.retryCount,
        scheduledInMs: result.delayMs ?? 0,
      });
    } catch (err) {
      next(err);
    }
  },

  async getUserInbox(req, res, next) {
    try {
      const items = await notificationQueryService.getUserInbox(req.params.userId);
      return ok(res, items);
    } catch (err) {
      next(err);
    }
  },
};

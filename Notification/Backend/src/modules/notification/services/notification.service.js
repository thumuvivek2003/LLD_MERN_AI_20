import { notificationRepository } from '../repositories/notification.repository.js';
import { notificationStatusService } from './notificationStatus.service.js';
import { retryService } from './retry.service.js';
import { createChannelStrategy } from '../factories/notificationChannel.factory.js';
import { templateRepository } from '../../template/repositories/template.repository.js';
import { templateRendererService } from '../../template/services/templateRenderer.service.js';
import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { generateId } from '../../../shared/utils/id.util.js';
import { getQueueInstance } from '../../../shared/queue/queueManager.js';
import { logger } from '../../../shared/logger/logger.js';
import { RETRY } from '../../../constants/retry.constants.js';

async function resolveRenderForNotification(notification) {
  if (notification.customSubject != null || notification.customBody != null) {
    return { subject: notification.customSubject ?? '', body: notification.customBody ?? '' };
  }
  if (!notification.templateId || notification.templateVersion == null) {
    return { subject: '', body: '' };
  }
  const versionObj = await templateRepository.findTemplateVersion(
    notification.templateId,
    notification.templateVersion,
  );
  return templateRendererService.render(versionObj, notification.payloadSnapshot || {});
}

export const notificationService = {
  /**
   * Persist a notification doc in QUEUED state and enqueue a job for the worker.
   */
  async createNotification(input) {
    const _id = generateId('n');
    const doc = await notificationRepository.create({
      _id,
      userId: input.userId,
      eventId: input.eventId || null,
      groupId: input.groupId || null,
      eventType: input.eventType || 'CUSTOM',
      channel: input.channel,
      templateId: input.templateId || null,
      templateVersion: input.templateVersion ?? null,
      payloadSnapshot: input.payloadSnapshot || {},
      customSubject: input.customSubject ?? null,
      customBody: input.customBody ?? null,
      status: 'QUEUED',
      retryCount: 0,
      attempts: [{ at: new Date(), status: 'QUEUED' }],
    });

    const queue = getQueueInstance();
    queue.enqueue({
      id: generateId('job'),
      notificationId: _id,
      attempt: 0,
      type: 'send',
    });

    notificationPublisher.publish(NOTIFICATION_EVENTS.QUEUED, {
      notificationId: _id,
      userId: input.userId,
      channel: input.channel,
      eventType: input.eventType,
    });

    return doc.toObject ? doc.toObject() : doc;
  },

  /**
   * Core delivery worker entry point. Called from notification.worker.js and
   * retry.worker.js with a job pulled off the queue.
   */
  async processNotification(job) {
    const notification = await notificationRepository.findById(job.notificationId);
    if (!notification) {
      logger.warn('worker.notification.missing', { jobId: job.id, notificationId: job.notificationId });
      return;
    }

    await notificationStatusService.markSending(notification._id);
    let rendered;
    try {
      rendered = await resolveRenderForNotification(notification);
    } catch (err) {
      const after = await notificationStatusService.resolveFailureNext(
        notification._id,
        `render_error: ${err.message}`,
        RETRY.MAX_ATTEMPTS,
      );
      notificationPublisher.publish(NOTIFICATION_EVENTS.FAILED, {
        notificationId: notification._id,
        error: err.message,
        terminal: after.status === 'DEAD',
      });
      return;
    }

    try {
      const strategy = createChannelStrategy(notification.channel);
      const result = await strategy.send(notification, rendered);

      if (result.success) {
        await notificationStatusService.markSent(notification._id);
        notificationPublisher.publish(NOTIFICATION_EVENTS.SENT, {
          notificationId: notification._id,
          channel: notification.channel,
          userId: notification.userId,
        });
        return;
      }
      const after = await notificationStatusService.resolveFailureNext(
        notification._id,
        result.error || 'send_failed',
        RETRY.MAX_ATTEMPTS,
      );
      notificationPublisher.publish(
        after.status === 'DEAD' ? NOTIFICATION_EVENTS.DEAD : NOTIFICATION_EVENTS.FAILED,
        {
          notificationId: notification._id,
          channel: notification.channel,
          error: result.error,
        },
      );
    } catch (err) {
      const after = await notificationStatusService.resolveFailureNext(
        notification._id,
        err.message || 'unknown_error',
        RETRY.MAX_ATTEMPTS,
      );
      notificationPublisher.publish(
        after.status === 'DEAD' ? NOTIFICATION_EVENTS.DEAD : NOTIFICATION_EVENTS.FAILED,
        {
          notificationId: notification._id,
          channel: notification.channel,
          error: err.message,
        },
      );
    }
  },

  retryNotification(id, opts) {
    return retryService.retryFailedNotification(id, opts);
  },
};

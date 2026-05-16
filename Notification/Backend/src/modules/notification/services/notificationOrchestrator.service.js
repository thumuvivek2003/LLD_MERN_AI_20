import { notificationService } from './notification.service.js';
import { templateService } from '../../template/services/template.service.js';
import { userRepository } from '../../user/repositories/user.repository.js';
import { generateId } from '../../../shared/utils/id.util.js';
import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { AppException } from '../../../shared/exceptions/app.exception.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { toNotificationResponse } from '../mappers/notification.mapper.js';

function channelsFromPreferences(prefs) {
  if (!prefs) return [];
  const out = [];
  if (prefs.emailEnabled) out.push(CHANNEL_TYPE.EMAIL);
  if (prefs.smsEnabled) out.push(CHANNEL_TYPE.SMS);
  if (prefs.pushEnabled) out.push(CHANNEL_TYPE.PUSH);
  return out;
}

/**
 * Orchestrator — the single entry point used by controllers.
 *
 * Responsibility:
 *   1. resolve target channels (explicit OR from user preferences)
 *   2. for each channel, find the active template for (eventType, channel)
 *   3. build a Notification with snapshot only (no rendered text persisted)
 *   4. enqueue via notificationService.createNotification
 *   5. return DTOs in the contract shape
 */
async function buildAndEnqueueForUser({
  user,
  eventId,
  groupId,
  eventType,
  channels,
  payload,
  templateIdOverride,
  custom,
}) {
  const results = [];
  for (const channel of channels) {
    let templateId = templateIdOverride || null;
    let templateVersion = null;
    let customSubject = null;
    let customBody = null;

    if (custom && (custom.subject || custom.body)) {
      customSubject = custom.subject || '';
      customBody = custom.body || '';
    } else if (templateIdOverride) {
      // Use the requested template's active version (channel must match)
      const tmpl = await templateService.getTemplate(templateIdOverride);
      if (tmpl.channel !== channel) {
        // Skip channels that don't match the chosen template — keep behaviour soft
        continue;
      }
      templateVersion = tmpl.activeVersion;
    } else {
      const active = await templateService.getActiveTemplate(eventType, channel);
      if (!active) {
        // No template configured for this (eventType, channel) — skip cleanly
        continue;
      }
      templateId = active.templateId;
      templateVersion = active.version;
    }

    const doc = await notificationService.createNotification({
      userId: user._id || user.id,
      eventId,
      groupId,
      eventType,
      channel,
      templateId,
      templateVersion,
      payloadSnapshot: payload,
      customSubject,
      customBody,
    });
    results.push(doc);
  }
  return results;
}

export const notificationOrchestratorService = {
  /**
   * POST /api/notifications/trigger
   */
  async handleEventNotificationFlow({ userId, eventType, payload, channels }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppException('USER_NOT_FOUND', `User ${userId} not found`, 404);

    const resolvedChannels =
      Array.isArray(channels) && channels.length ? channels : channelsFromPreferences(user.preferences);

    if (!resolvedChannels.length) {
      return { eventId: generateId('evt'), notifications: [] };
    }

    const eventId = generateId('evt');
    notificationPublisher.publish(NOTIFICATION_EVENTS.TRIGGERED, {
      eventId,
      userId,
      eventType,
      channels: resolvedChannels,
    });

    const docs = await buildAndEnqueueForUser({
      user,
      eventId,
      eventType,
      channels: resolvedChannels,
      payload: payload || {},
    });

    return {
      eventId,
      notifications: docs.map((d) => ({ id: d._id, channel: d.channel, status: d.status })),
    };
  },

  /**
   * POST /api/notifications/send — admin-triggered single notification (templated or custom).
   */
  async handleAdminSend({ userId, templateId, eventType, channels, payload, custom }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppException('USER_NOT_FOUND', `User ${userId} not found`, 404);

    const eventId = generateId('evt');
    const docs = await buildAndEnqueueForUser({
      user,
      eventId,
      eventType: eventType || 'CUSTOM',
      channels,
      payload: payload || {},
      templateIdOverride: templateId,
      custom,
    });

    return {
      eventId,
      notifications: await Promise.all(docs.map((d) => toNotificationResponse(d))),
    };
  },

  /**
   * POST /api/notifications/send-group — same template to many users.
   */
  async handleGroupSend({ userIds, templateId, eventType, channels, payload, custom }) {
    const users = await userRepository.findManyByIds(userIds);
    const groupId = generateId('grp');
    let count = 0;
    for (const user of users) {
      const docs = await buildAndEnqueueForUser({
        user,
        eventId: generateId('evt'),
        groupId,
        eventType: eventType || 'CUSTOM',
        channels,
        payload: payload || {},
        templateIdOverride: templateId,
        custom,
      });
      count += docs.length;
    }
    return { groupId, count };
  },
};

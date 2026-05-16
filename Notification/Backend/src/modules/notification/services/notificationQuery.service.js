import { notificationRepository } from '../repositories/notification.repository.js';
import { toNotificationResponseList, toNotificationResponse } from '../mappers/notification.mapper.js';
import { NotificationNotFoundException } from '../../../shared/exceptions/notification.exception.js';

function buildFilter({ status, channel, eventType, userId }) {
  const filter = {};
  if (status) filter.status = status;
  if (channel) filter.channel = channel;
  if (eventType) filter.eventType = eventType;
  if (userId) filter.userId = userId;
  return filter;
}

export const notificationQueryService = {
  async getNotifications(query = {}) {
    const limit = Math.min(parseInt(query.limit, 10) || 50, 200);
    const filter = buildFilter(query);
    const rows = await notificationRepository.find(filter, { limit });
    return {
      items: await toNotificationResponseList(rows),
      nextCursor: null,
    };
  },

  async getNotificationById(id) {
    const row = await notificationRepository.findById(id);
    if (!row) throw new NotificationNotFoundException(id);
    return toNotificationResponse(row);
  },

  async getUserInbox(userId, limit = 50) {
    const rows = await notificationRepository.find({ userId }, { limit });
    return toNotificationResponseList(rows);
  },

  async getRecentNotifications(limit = 20) {
    const rows = await notificationRepository.find({}, { limit });
    return toNotificationResponseList(rows);
  },

  async getNotificationsByStatus(status, limit = 50) {
    const rows = await notificationRepository.find({ status }, { limit });
    return toNotificationResponseList(rows);
  },
};

import { notificationRepository } from '../../notification/repositories/notification.repository.js';
import { toNotificationResponseList } from '../../notification/mappers/notification.mapper.js';
import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';

function bucket(rows, key) {
  const out = {};
  for (const r of rows) {
    out[r._id] = (out[r._id] || 0) + (r.count || 0);
  }
  return out;
}

export const adminDashboardService = {
  async getDashboardMetrics() {
    const [byStatus, byChannel, recentFailures] = await Promise.all([
      notificationRepository.countByStatus(),
      notificationRepository.countByChannel(),
      notificationRepository.findFailedNotifications(10),
    ]);
    const statusBucket = bucket(byStatus);
    const channelBucket = bucket(byChannel);
    return {
      totals: {
        sent: statusBucket[NOTIFICATION_STATUS.SENT] || 0,
        failed:
          (statusBucket[NOTIFICATION_STATUS.FAILED] || 0) +
          (statusBucket[NOTIFICATION_STATUS.DEAD] || 0),
        queued: statusBucket[NOTIFICATION_STATUS.QUEUED] || 0,
        retrying: statusBucket[NOTIFICATION_STATUS.RETRYING] || 0,
        sending: statusBucket[NOTIFICATION_STATUS.SENDING] || 0,
        dead: statusBucket[NOTIFICATION_STATUS.DEAD] || 0,
      },
      channelBreakdown: {
        EMAIL: channelBucket.EMAIL || 0,
        SMS: channelBucket.SMS || 0,
        PUSH: channelBucket.PUSH || 0,
      },
      recentFailures: await toNotificationResponseList(recentFailures),
    };
  },

  async getRecentFailures(limit = 20) {
    const rows = await notificationRepository.findFailedNotifications(limit);
    return toNotificationResponseList(rows);
  },

  async getSystemStats() {
    const [byStatus, byChannel, byEvent] = await Promise.all([
      notificationRepository.countByStatus(),
      notificationRepository.countByChannel(),
      notificationRepository.countByEventType(),
    ]);
    return {
      byStatus: bucket(byStatus),
      byChannel: bucket(byChannel),
      byEventType: bucket(byEvent),
    };
  },
};

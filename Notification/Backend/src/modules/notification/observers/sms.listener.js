import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { logger } from '../../../shared/logger/logger.js';

export function handleSMSNotification() {
  notificationPublisher.subscribe(NOTIFICATION_EVENTS.SENT, (payload) => {
    if (payload?.channel === CHANNEL_TYPE.SMS) {
      logger.info('observer.sms.sent', payload);
    }
  });
}

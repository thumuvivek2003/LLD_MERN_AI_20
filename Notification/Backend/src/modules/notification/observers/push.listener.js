import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { logger } from '../../../shared/logger/logger.js';

export function handlePushNotification() {
  notificationPublisher.subscribe(NOTIFICATION_EVENTS.SENT, (payload) => {
    if (payload?.channel === CHANNEL_TYPE.PUSH) {
      logger.info('observer.push.sent', payload);
    }
  });
}

import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { logger } from '../../../shared/logger/logger.js';

/**
 * Channel-specific observer — would integrate with an analytics pipeline in
 * a real system. Here it just structurally logs the delivery.
 */
export function handleEmailNotification() {
  notificationPublisher.subscribe(NOTIFICATION_EVENTS.SENT, (payload) => {
    if (payload?.channel === CHANNEL_TYPE.EMAIL) {
      logger.info('observer.email.sent', payload);
    }
  });
}

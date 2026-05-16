import { notificationPublisher } from '../events/notification.publisher.js';
import { NOTIFICATION_EVENTS } from '../events/notification.events.js';
import { logger } from '../../../shared/logger/logger.js';

/**
 * Catch-all observer that logs every notification event. Useful for the
 * admin/system dashboards and proves the observer pattern is wired.
 */
export function onNotificationEvent() {
  Object.values(NOTIFICATION_EVENTS).forEach((event) => {
    notificationPublisher.subscribe(event, (payload) => {
      logger.info(`event.${event}`, payload);
    });
  });
}

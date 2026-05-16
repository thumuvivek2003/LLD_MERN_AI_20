import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';
import { InvalidNotificationStateException } from '../../../shared/exceptions/notification.exception.js';

/**
 * State pattern — each state object exposes handle(currentStatus): nextStatus
 * and validates whether the transition is legal. State objects are stateless
 * singletons keyed by name.
 */
export const queuedState = {
  name: NOTIFICATION_STATUS.QUEUED,
  handle(current) {
    // Allowed previous states for transitioning INTO queued
    if (![null, undefined, NOTIFICATION_STATUS.QUEUED, NOTIFICATION_STATUS.RETRYING].includes(current)) {
      throw new InvalidNotificationStateException(`Cannot transition ${current} → QUEUED`);
    }
    return NOTIFICATION_STATUS.QUEUED;
  },
};

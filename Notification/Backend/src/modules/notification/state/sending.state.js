import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';
import { InvalidNotificationStateException } from '../../../shared/exceptions/notification.exception.js';

export const sendingState = {
  name: NOTIFICATION_STATUS.SENDING,
  handle(current) {
    const allowed = [NOTIFICATION_STATUS.QUEUED, NOTIFICATION_STATUS.RETRYING];
    if (!allowed.includes(current)) {
      throw new InvalidNotificationStateException(`Cannot transition ${current} → SENDING`);
    }
    return NOTIFICATION_STATUS.SENDING;
  },
};

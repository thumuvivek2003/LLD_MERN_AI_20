import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';
import { InvalidNotificationStateException } from '../../../shared/exceptions/notification.exception.js';

export const sentState = {
  name: NOTIFICATION_STATUS.SENT,
  handle(current) {
    if (current !== NOTIFICATION_STATUS.SENDING) {
      throw new InvalidNotificationStateException(`Cannot transition ${current} → SENT`);
    }
    return NOTIFICATION_STATUS.SENT;
  },
};

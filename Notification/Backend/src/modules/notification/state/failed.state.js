import { NOTIFICATION_STATUS } from '../../../constants/notificationStatus.constants.js';
import { InvalidNotificationStateException } from '../../../shared/exceptions/notification.exception.js';

export const failedState = {
  name: NOTIFICATION_STATUS.FAILED,
  handle(current) {
    const allowed = [NOTIFICATION_STATUS.SENDING, NOTIFICATION_STATUS.RETRYING];
    if (!allowed.includes(current)) {
      throw new InvalidNotificationStateException(`Cannot transition ${current} → FAILED`);
    }
    return NOTIFICATION_STATUS.FAILED;
  },
};

export const retryingState = {
  name: NOTIFICATION_STATUS.RETRYING,
  handle(current) {
    const allowed = [NOTIFICATION_STATUS.FAILED, NOTIFICATION_STATUS.DEAD];
    if (!allowed.includes(current)) {
      throw new InvalidNotificationStateException(`Cannot transition ${current} → RETRYING`);
    }
    return NOTIFICATION_STATUS.RETRYING;
  },
};

export const deadState = {
  name: NOTIFICATION_STATUS.DEAD,
  handle(current) {
    const allowed = [
      NOTIFICATION_STATUS.SENDING,
      NOTIFICATION_STATUS.FAILED,
      NOTIFICATION_STATUS.RETRYING,
    ];
    if (!allowed.includes(current)) {
      throw new InvalidNotificationStateException(`Cannot transition ${current} → DEAD`);
    }
    return NOTIFICATION_STATUS.DEAD;
  },
};

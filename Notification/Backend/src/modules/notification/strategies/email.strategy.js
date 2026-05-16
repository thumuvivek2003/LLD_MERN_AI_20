import { NotificationStrategy } from './base/notification.strategy.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { logger } from '../../../shared/logger/logger.js';

class EmailStrategy extends NotificationStrategy {
  constructor() {
    super(CHANNEL_TYPE.EMAIL);
  }

  async send(notification, rendered) {
    logger.info('channel.email.send', {
      notificationId: notification._id || notification.id,
      to: notification.userId,
      subject: rendered.subject,
    });
    return this._simulateOutcome('email');
  }
}

export const emailStrategy = new EmailStrategy();
export default emailStrategy;

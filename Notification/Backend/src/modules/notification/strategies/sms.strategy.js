import { NotificationStrategy } from './base/notification.strategy.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { logger } from '../../../shared/logger/logger.js';

class SmsStrategy extends NotificationStrategy {
  constructor() {
    super(CHANNEL_TYPE.SMS);
  }

  async send(notification, rendered) {
    logger.info('channel.sms.send', {
      notificationId: notification._id || notification.id,
      to: notification.userId,
      body: rendered.body,
    });
    return this._simulateOutcome('sms');
  }
}

export const smsStrategy = new SmsStrategy();
export default smsStrategy;

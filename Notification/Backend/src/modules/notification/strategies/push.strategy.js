import { NotificationStrategy } from './base/notification.strategy.js';
import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { logger } from '../../../shared/logger/logger.js';

class PushStrategy extends NotificationStrategy {
  constructor() {
    super(CHANNEL_TYPE.PUSH);
  }

  async send(notification, rendered) {
    logger.info('channel.push.send', {
      notificationId: notification._id || notification.id,
      to: notification.userId,
      title: rendered.subject,
      body: rendered.body,
    });
    return this._simulateOutcome('push');
  }
}

export const pushStrategy = new PushStrategy();
export default pushStrategy;

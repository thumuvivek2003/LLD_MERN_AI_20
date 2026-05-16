import { AppException } from './app.exception.js';

export class NotificationNotFoundException extends AppException {
  constructor(id) {
    super('NOTIFICATION_NOT_FOUND', `Notification ${id} not found`, 404);
    this.name = 'NotificationNotFoundException';
  }
}

export class InvalidNotificationStateException extends AppException {
  constructor(message) {
    super('INVALID_NOTIFICATION_STATE', message, 409);
    this.name = 'InvalidNotificationStateException';
  }
}

export class ChannelDeliveryException extends AppException {
  constructor(channel, message) {
    super('CHANNEL_DELIVERY_FAILED', message, 502, { channel });
    this.name = 'ChannelDeliveryException';
  }
}

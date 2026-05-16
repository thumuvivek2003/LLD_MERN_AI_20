import { ValidationException } from '../../../shared/exceptions/validation.exception.js';
import { CHANNEL_TYPE_VALUES } from '../../../constants/channelType.constants.js';
import { EVENT_TYPE_VALUES } from '../../../constants/eventType.constants.js';

export function validateNotificationPayload(payload) {
  const errors = [];
  if (!payload) throw new ValidationException('Notification payload is required');
  if (!payload.userId) errors.push('userId is required');
  if (!payload.channel || !CHANNEL_TYPE_VALUES.includes(payload.channel)) {
    errors.push(`channel must be one of ${CHANNEL_TYPE_VALUES.join(', ')}`);
  }
  if (payload.eventType && !EVENT_TYPE_VALUES.includes(payload.eventType)) {
    errors.push(`eventType must be one of ${EVENT_TYPE_VALUES.join(', ')}`);
  }
  if (errors.length) throw new ValidationException('Invalid notification payload', errors);
  return payload;
}

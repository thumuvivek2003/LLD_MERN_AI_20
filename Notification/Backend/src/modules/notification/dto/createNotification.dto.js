import { ValidationException } from '../../../shared/exceptions/validation.exception.js';
import { CHANNEL_TYPE_VALUES } from '../../../constants/channelType.constants.js';
import { EVENT_TYPE_VALUES } from '../../../constants/eventType.constants.js';

/**
 * Sanitizes the body for POST /api/notifications/trigger and /send.
 * Returns a normalized object; throws ValidationException on invalid input.
 */
export function buildTriggerDto(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationException('Request body is required');
  }
  const errors = [];
  if (!body.userId) errors.push('userId is required');
  if (!body.eventType) errors.push('eventType is required');
  if (body.eventType && !EVENT_TYPE_VALUES.includes(body.eventType)) {
    errors.push(`eventType must be one of ${EVENT_TYPE_VALUES.join(', ')}`);
  }
  if (body.channels && !Array.isArray(body.channels)) {
    errors.push('channels must be an array');
  }
  if (Array.isArray(body.channels)) {
    for (const c of body.channels) {
      if (!CHANNEL_TYPE_VALUES.includes(c)) {
        errors.push(`channel must be one of ${CHANNEL_TYPE_VALUES.join(', ')}`);
        break;
      }
    }
  }
  if (errors.length) throw new ValidationException('Invalid trigger payload', errors);
  return {
    userId: body.userId,
    eventType: body.eventType,
    payload: body.payload && typeof body.payload === 'object' ? body.payload : {},
    channels: Array.isArray(body.channels) ? body.channels : null,
  };
}

export function buildSendDto(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationException('Request body is required');
  }
  const errors = [];
  if (!body.userId) errors.push('userId is required');
  if (body.eventType && !EVENT_TYPE_VALUES.includes(body.eventType)) {
    errors.push(`eventType must be one of ${EVENT_TYPE_VALUES.join(', ')}`);
  }
  if (!Array.isArray(body.channels) || body.channels.length === 0) {
    errors.push('channels (non-empty array) is required');
  }
  if (Array.isArray(body.channels)) {
    for (const c of body.channels) {
      if (!CHANNEL_TYPE_VALUES.includes(c)) {
        errors.push(`channel must be one of ${CHANNEL_TYPE_VALUES.join(', ')}`);
        break;
      }
    }
  }
  if (errors.length) throw new ValidationException('Invalid send payload', errors);
  return {
    userId: body.userId,
    templateId: body.templateId || null,
    eventType: body.eventType || 'CUSTOM',
    channels: body.channels,
    payload: body.payload && typeof body.payload === 'object' ? body.payload : {},
    custom: body.custom && typeof body.custom === 'object' ? body.custom : null,
  };
}

export function buildSendGroupDto(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationException('Request body is required');
  }
  const errors = [];
  if (!Array.isArray(body.userIds) || body.userIds.length === 0) {
    errors.push('userIds (non-empty array) is required');
  }
  if (!Array.isArray(body.channels) || body.channels.length === 0) {
    errors.push('channels (non-empty array) is required');
  }
  if (Array.isArray(body.channels)) {
    for (const c of body.channels) {
      if (!CHANNEL_TYPE_VALUES.includes(c)) {
        errors.push(`channel must be one of ${CHANNEL_TYPE_VALUES.join(', ')}`);
        break;
      }
    }
  }
  if (errors.length) throw new ValidationException('Invalid send-group payload', errors);
  return {
    userIds: body.userIds,
    templateId: body.templateId || null,
    eventType: body.eventType || 'CUSTOM',
    channels: body.channels,
    payload: body.payload && typeof body.payload === 'object' ? body.payload : {},
    custom: body.custom && typeof body.custom === 'object' ? body.custom : null,
  };
}

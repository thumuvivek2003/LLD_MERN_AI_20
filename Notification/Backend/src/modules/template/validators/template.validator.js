import { ValidationException } from '../../../shared/exceptions/validation.exception.js';
import { CHANNEL_TYPE_VALUES } from '../../../constants/channelType.constants.js';
import { EVENT_TYPE_VALUES } from '../../../constants/eventType.constants.js';

export function validateTemplate(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    throw new ValidationException('Template payload is required');
  }
  if (!payload.name) errors.push('name is required');
  if (!payload.eventType || !EVENT_TYPE_VALUES.includes(payload.eventType)) {
    errors.push(`eventType must be one of ${EVENT_TYPE_VALUES.join(', ')}`);
  }
  if (!payload.channel || !CHANNEL_TYPE_VALUES.includes(payload.channel)) {
    errors.push(`channel must be one of ${CHANNEL_TYPE_VALUES.join(', ')}`);
  }
  if (!payload.bodyTemplate || typeof payload.bodyTemplate !== 'string') {
    errors.push('bodyTemplate is required');
  }
  if (errors.length) throw new ValidationException('Invalid template', errors);
  return {
    name: payload.name,
    eventType: payload.eventType,
    channel: payload.channel,
    subjectTemplate: payload.subjectTemplate || '',
    bodyTemplate: payload.bodyTemplate,
  };
}

export function validateNewVersion(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    throw new ValidationException('Version payload is required');
  }
  if (!payload.bodyTemplate || typeof payload.bodyTemplate !== 'string') {
    errors.push('bodyTemplate is required');
  }
  if (errors.length) throw new ValidationException('Invalid template version', errors);
  return {
    subjectTemplate: payload.subjectTemplate || '',
    bodyTemplate: payload.bodyTemplate,
  };
}

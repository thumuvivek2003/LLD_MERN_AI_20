// modules/status/status.validator.js — validateCreateStatus()
import { PRIVACY, PRIVACY_VALUES } from '../../core/constants/privacy.constants.js';
import { STATUS_BACKGROUNDS, DEFAULT_BACKGROUND, MAX_STATUS_LENGTH } from './status.constants.js';
import { ValidationError } from '../../core/errors/validation.error.js';

export function validateCreateStatus(body = {}) {
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) throw new ValidationError('Status text is required');
  if (text.length > MAX_STATUS_LENGTH) {
    throw new ValidationError(`Status text must be under ${MAX_STATUS_LENGTH} characters`);
  }

  const privacy = PRIVACY_VALUES.includes(body.privacy) ? body.privacy : PRIVACY.EVERYONE;
  const background = STATUS_BACKGROUNDS.includes(body.background) ? body.background : DEFAULT_BACKGROUND;

  const includeUsers = Array.isArray(body.includeUsers) ? body.includeUsers.map(String) : [];
  const excludeUsers = Array.isArray(body.excludeUsers) ? body.excludeUsers.map(String) : [];

  if (privacy === PRIVACY.ONLY_SHARE_WITH && includeUsers.length === 0) {
    throw new ValidationError('Select at least one contact to share with');
  }

  return { text, privacy, background, includeUsers, excludeUsers };
}

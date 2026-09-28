import { BadRequestError } from '../../core/exceptions/bad-request.error.js';
import { OBJECT_COLORS } from '../../config/constants.js';

export function assertCreateObjectPayload(body = {}) {
  if (!body.label || typeof body.label !== 'string') throw new BadRequestError('label is required');
  if (body.label.length > 60) throw new BadRequestError('label must be 60 characters or fewer');
  if (body.color && !OBJECT_COLORS.includes(body.color)) {
    throw new BadRequestError(`color must be one of: ${OBJECT_COLORS.join(', ')}`);
  }
  if (body.fields && !Array.isArray(body.fields)) throw new BadRequestError('fields must be an array');
}

export function assertClonePayload(body = {}) {
  if (!body.label) throw new BadRequestError('label is required to clone an object');
}

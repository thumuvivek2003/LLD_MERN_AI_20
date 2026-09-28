import { BadRequestError } from '../../core/exceptions/bad-request.error.js';
import { fieldTypeRegistry } from './types/field-type.registry.js';

/** Request-shape checks for field metadata (not record data — that's the validation engine). */
export function assertCreateFieldPayload(body = {}) {
  if (!body.label || typeof body.label !== 'string') throw new BadRequestError('label is required');
  if (!body.type) throw new BadRequestError('type is required');
  if (!fieldTypeRegistry.has(body.type)) throw new BadRequestError(`Unknown field type '${body.type}'`);
  const v = body.validation || {};
  if (v.regex) {
    try {
      new RegExp(v.regex);
    } catch {
      throw new BadRequestError(`validation.regex is not a valid regular expression`);
    }
  }
  if (v.min !== null && v.min !== undefined && v.max !== null && v.max !== undefined && Number(v.min) > Number(v.max)) {
    throw new BadRequestError('validation.min cannot exceed validation.max');
  }
}

export function assertReorderPayload(body = {}) {
  if (!Array.isArray(body.order) || !body.order.length) throw new BadRequestError('order must be a non-empty array of fieldIds');
}

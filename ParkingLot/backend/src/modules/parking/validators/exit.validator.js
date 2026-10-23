import { ValidationError } from '../../../shared/exceptions/validation-error.js';

export const validateTicketCode = (ticketCode) => {
  if (!ticketCode || typeof ticketCode !== 'string') throw new ValidationError('ticketCode is required');
};

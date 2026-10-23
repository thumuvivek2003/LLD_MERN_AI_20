import { TICKET_PREFIX } from '../config/constants.js';

export const TicketIdGenerator = {
  generate() {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${TICKET_PREFIX}-${Date.now()}-${random}`;
  },
};

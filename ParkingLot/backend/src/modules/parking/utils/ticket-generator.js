import { randomUUID } from 'crypto';

export const generateTicketCode = () =>
  `TKT-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

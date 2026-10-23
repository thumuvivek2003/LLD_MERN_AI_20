import { db } from '../../../config/db.config.js';
import { BaseRepository } from '../../../shared/database/base.repository.js';

class PaymentRepository extends BaseRepository {
  constructor() { super(db.payments); }
  findByTicket(ticketId) { return this.findOne((p) => p.ticketId === ticketId); }
}

export const paymentRepository = new PaymentRepository();

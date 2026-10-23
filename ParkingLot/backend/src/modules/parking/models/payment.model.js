import { PaymentStatus } from '../../../shared/enums/payment-status.enum.js';

export class Payment {
  constructor({ id, ticketId, amount, status = PaymentStatus.PENDING, paidAt = null }) {
    this.id = id;
    this.ticketId = ticketId;
    this.amount = amount;
    this.status = status;
    this.paidAt = paidAt;
  }
}

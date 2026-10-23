import { PaymentStatus } from '../enums/PaymentStatus.js';

export class Payment {
  constructor({ id, ticketId, amount, status = PaymentStatus.PENDING, method, paidAt = null }) {
    this.id = id;
    this.ticketId = ticketId;
    this.amount = amount;
    this.status = status;
    this.method = method;
    this.paidAt = paidAt;
  }

  markPaid(method) {
    this.status = PaymentStatus.PAID;
    this.method = method;
    this.paidAt = new Date();
  }
}

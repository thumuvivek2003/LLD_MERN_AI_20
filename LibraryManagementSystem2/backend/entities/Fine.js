import { FineStatus } from '../enums/FineStatus.js';

export class Fine {
  constructor(data) {
    this._id = data._id;
    this.user = data.user;
    this.borrowRequest = data.borrowRequest;
    this.amount = data.amount;
    this.status = data.status;
    this.paidAt = data.paidAt;
  }

  markPaid() {
    this.status = FineStatus.PAID;
    this.paidAt = new Date();
  }

  isPending() {
    return this.status === FineStatus.PENDING;
  }
}

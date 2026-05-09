import { RequestStatus } from '../enums/RequestStatus.js';

export class BorrowRequest {
  constructor(data) {
    this._id = data._id;
    this.user = data.user;
    this.book = data.book;
    this.status = data.status;
    this.borrowDate = data.borrowDate;
    this.dueDate = data.dueDate;
    this.returnDate = data.returnDate;
  }

  approve() {
    this.status = RequestStatus.APPROVED;
    this.borrowDate = new Date();
    this.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }

  reject() {
    this.status = RequestStatus.REJECTED;
  }

  returnBook() {
    this.status = RequestStatus.RETURNED;
    this.returnDate = new Date();
  }

  calculateFine(ratePerDay = 5) {
    if (!this.dueDate || !this.returnDate) return 0;
    const overdueDays = Math.max(
      0,
      Math.ceil((new Date(this.returnDate) - new Date(this.dueDate)) / (1000 * 60 * 60 * 24))
    );
    return overdueDays * ratePerDay;
  }
}

import { BorrowState } from './BorrowState.js';

export class OverdueState extends BorrowState {
  calculateFine(borrowRequest, ratePerDay = 5) {
    const overdueDays = Math.max(
      0,
      Math.ceil((Date.now() - new Date(borrowRequest.dueDate)) / (1000 * 60 * 60 * 24))
    );
    return overdueDays * ratePerDay;
  }
}

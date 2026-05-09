import { BorrowState } from './BorrowState.js';
import { RequestStatus } from '../enums/RequestStatus.js';

export class ApprovedState extends BorrowState {
  returnBook(borrowRequest) {
    borrowRequest.status = RequestStatus.RETURNED;
    borrowRequest.returnDate = new Date();
  }

  markOverdue(borrowRequest) {
    borrowRequest.status = RequestStatus.OVERDUE;
  }
}

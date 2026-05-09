import { BorrowState } from './BorrowState.js';
import { RequestStatus } from '../enums/RequestStatus.js';

export class PendingState extends BorrowState {
  approve(borrowRequest) {
    borrowRequest.status = RequestStatus.APPROVED;
    borrowRequest.borrowDate = new Date();
    borrowRequest.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }

  reject(borrowRequest) {
    borrowRequest.status = RequestStatus.REJECTED;
  }
}

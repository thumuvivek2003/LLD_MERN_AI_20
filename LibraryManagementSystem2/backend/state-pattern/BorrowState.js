export class BorrowState {
  approve(borrowRequest) {
    throw new Error('approve() not supported in this state');
  }

  reject(borrowRequest) {
    throw new Error('reject() not supported in this state');
  }

  returnBook(borrowRequest) {
    throw new Error('returnBook() not supported in this state');
  }

  markOverdue(borrowRequest) {
    throw new Error('markOverdue() not supported in this state');
  }

  calculateFine(borrowRequest) {
    throw new Error('calculateFine() not supported in this state');
  }
}

import { BorrowRepository } from '../repositories/BorrowRepository.js';
import { BookRepository } from '../repositories/BookRepository.js';
import { BorrowStateFactory } from '../factories/BorrowStateFactory.js';
import { RequestStatus } from '../enums/RequestStatus.js';

const borrowRepository = new BorrowRepository();
const bookRepository = new BookRepository();

export class BorrowService {
  async requestBorrow(userId, bookId) {
    const book = await bookRepository.findById(bookId);
    if (!book || book.availableCopies <= 0) throw new Error('Book not available');
    return borrowRepository.create({ user: userId, book: bookId, status: RequestStatus.PENDING });
  }

  async approveRequest(requestId) {
    const request = await borrowRepository.findById(requestId);
    if (!request) throw new Error('Request not found');
    const state = BorrowStateFactory.createState(request.status);
    state.approve(request);
    await bookRepository.update(request.book._id, { $inc: { availableCopies: -1 } });
    return borrowRepository.update(requestId, {
      status: request.status,
      borrowDate: request.borrowDate,
      dueDate: request.dueDate,
    });
  }

  async rejectRequest(requestId) {
    const request = await borrowRepository.findById(requestId);
    if (!request) throw new Error('Request not found');
    const state = BorrowStateFactory.createState(request.status);
    state.reject(request);
    return borrowRepository.update(requestId, { status: request.status });
  }

  async returnBook(requestId) {
    const request = await borrowRepository.findById(requestId);
    if (!request) throw new Error('Request not found');
    const state = BorrowStateFactory.createState(request.status);
    state.returnBook(request);
    await bookRepository.update(request.book._id, { $inc: { availableCopies: 1 } });
    return borrowRepository.update(requestId, {
      status: request.status,
      returnDate: request.returnDate,
    });
  }

  async markOverdue() {
    const overdueRequests = await borrowRepository.findOverdue();
    return Promise.all(
      overdueRequests.map(r => borrowRepository.update(r._id, { status: RequestStatus.OVERDUE }))
    );
  }

  async getUserBorrowHistory(userId) {
    return borrowRepository.findByUser(userId);
  }
}

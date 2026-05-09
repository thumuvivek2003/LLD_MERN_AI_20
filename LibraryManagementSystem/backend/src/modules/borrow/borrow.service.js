const ApiError = require('../../utils/ApiError');
const borrowRepository = require('./borrow.repository');
const bookRepository = require('../books/book.repository');
const fineRepository = require('../fines/fine.repository');
const reservationRepository = require('../reservations/reservation.repository');
const { BORROW_STATUS } = require('../../models/BorrowRecord');
const { RESERVATION_STATUS } = require('../../models/Reservation');

const BORROW_DURATION_DAYS = () => parseInt(process.env.BORROW_DURATION_DAYS) || 14;
const FINE_PER_DAY = () => parseFloat(process.env.FINE_PER_DAY) || 1;

class BorrowService {
  async borrowBook(userId, bookId) {
    const existing = await borrowRepository.findActiveByUserAndBook(userId, bookId);
    if (existing) throw new ApiError(400, 'You already have an active borrow for this book.');

    // Atomic decrement — null means no available copies
    const book = await bookRepository.atomicDecrementCopies(bookId);
    if (!book) throw new ApiError(400, 'No available copies. Please reserve the book.');

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_DURATION_DAYS());

    const record = await borrowRepository.create({ userId, bookId, dueDate });

    // Complete any pending reservation for this user+book
    await reservationRepository.completeReservation(userId, bookId);

    // Sync book status
    if (book.availableCopies === 0) {
      await bookRepository.updateStatus(bookId, 'BORROWED');
    }

    return borrowRepository.findById(record._id);
  }

  async returnBook(borrowRecordId, userId) {
    const record = await borrowRepository.findById(borrowRecordId);
    if (!record) throw new ApiError(404, 'Borrow record not found.');
    if (record.userId._id.toString() !== userId.toString()) {
      throw new ApiError(403, 'You are not authorized to return this book.');
    }
    if (record.status === BORROW_STATUS.RETURNED) {
      throw new ApiError(400, 'Book already returned.');
    }

    const returnDate = new Date();
    let fineAmount = 0;

    if (returnDate > record.dueDate) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysOverdue = Math.ceil((returnDate - record.dueDate) / msPerDay);
      fineAmount = daysOverdue * FINE_PER_DAY();

      await fineRepository.create({
        userId,
        borrowRecordId,
        bookId: record.bookId._id,
        amount: fineAmount,
        daysOverdue,
      });
    }

    await borrowRepository.updateById(borrowRecordId, {
      status: BORROW_STATUS.RETURNED,
      returnDate,
      fineAmount,
    });

    // Restore available copies and sync status
    const updatedBook = await bookRepository.atomicIncrementCopies(record.bookId._id);
    if (updatedBook && updatedBook.availableCopies > 0) {
      await bookRepository.updateStatus(record.bookId._id, 'AVAILABLE');
    }

    return { record: await borrowRepository.findById(borrowRecordId), fineAmount };
  }

  async getBorrowHistory(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      borrowRepository.findByUser(userId, skip, Number(limit)),
      borrowRepository.countByUser(userId),
    ]);
    return { records, total, page: Number(page), pages: Math.ceil(total / limit) };
  }

  async getAllActiveBorrows(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      borrowRepository.findAllActive(skip, Number(limit)),
      borrowRepository.countActive(),
    ]);
    return { records, total, page: Number(page), pages: Math.ceil(total / limit) };
  }

  async markOverdueBorrows() {
    const overdue = await borrowRepository.findOverdue();
    await Promise.all(
      overdue.map((r) => borrowRepository.updateById(r._id, { status: BORROW_STATUS.OVERDUE }))
    );
    return overdue.length;
  }
}

module.exports = new BorrowService();

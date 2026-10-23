import * as bookRepo from '../repositories/book.repo.js';
import * as transactionRepo from '../repositories/transaction.repo.js';
import * as reservationRepo from '../repositories/reservation.repo.js';
import { getConfig } from '../config/env.js';
import { addDays, now } from '../utils/time.utils.js';

export const addBook = async (data) => {
  data.availableCopies = data.totalCopies;
  return await bookRepo.createBook(data);
};

export const updateBook = async (bookId, data) => {
  const book = await bookRepo.findBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  return await bookRepo.updateBook(bookId, data);
};

export const deleteBook = async (bookId) => {
  const book = await bookRepo.findBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  return await bookRepo.updateBook(bookId, { status: 'deleted' });
};

export const getBook = async (bookId) => {
  const book = await bookRepo.findBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
};

export const listBooks = async (filter = {}) => {
  return await bookRepo.findBooks(filter);
};

export const checkAvailability = async (bookId) => {
  const book = await bookRepo.findBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  return book.availableCopies > 0;
};

export const reserveBook = async (userId, bookId) => {
  const book = await bookRepo.findBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }

  const activeReservation = await reservationRepo.findActiveReservationForBook(bookId);
  if (activeReservation) {
    throw new Error('Book already reserved');
  }

  if (book.availableCopies === 0) {
    const config = getConfig();
    const expiryDate = addDays(now(), config.reservationExpiryHours / 24);
    return await reservationRepo.createReservation({
      book: bookId,
      user: userId,
      expiryDate
    });
  }

  throw new Error('Book is available, no need to reserve');
};

export const cancelReservation = async (resId, userId) => {
  const reservation = await reservationRepo.findReservationById(resId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.user._id.toString() !== userId.toString()) {
    throw new Error('Unauthorized to cancel this reservation');
  }

  reservation.status = 'cancelled';
  await reservation.save();
  return reservation;
};

export const issueBook = async (librarianId, userId, bookId) => {
  const book = await bookRepo.findBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }

  if (book.availableCopies === 0) {
    throw new Error('Book not available');
  }

  const activeTransaction = await transactionRepo.findActiveTransaction(userId, bookId);
  if (activeTransaction) {
    throw new Error('Book already issued to this user');
  }

  const config = getConfig();
  const issueDate = now();
  const dueDate = addDays(issueDate, config.borrowDurationDays);

  const transaction = await transactionRepo.createTransaction({
    book: bookId,
    user: userId,
    issuedBy: librarianId,
    issueDate,
    dueDate
  });

  book.availableCopies -= 1;
  if (book.availableCopies === 0) {
    book.status = 'issued';
  }
  await book.save();

  return transaction;
};

export const returnBook = async (librarianId, userId, bookId) => {
  const activeTransaction = await transactionRepo.findActiveTransaction(userId, bookId);
  if (!activeTransaction) {
    throw new Error('No active transaction found');
  }

  const returnDate = now();
  const fine = activeTransaction.calculateFine(returnDate);

  activeTransaction.returnDate = returnDate;
  activeTransaction.fine = fine;
  activeTransaction.status = 'returned';
  await activeTransaction.save();

  const book = await bookRepo.findBookById(bookId);
  book.availableCopies += 1;
  book.status = 'available';
  await book.save();

  return activeTransaction;
};
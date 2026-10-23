import * as bookService from '../services/book.service.js';
import { success, error } from '../utils/responses.js';

export const addBook = async (req, res) => {
  try {
    const book = await bookService.addBook(req.body);
    success(res, book, 'Book added successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const listBooks = async (req, res) => {
  try {
    const books = await bookService.listBooks(req.query);
    success(res, books, 'Books fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await bookService.getBook(req.params.id);
    success(res, book, 'Book fetched successfully');
  } catch (err) {
    error(res, err.message, 404);
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    success(res, book, 'Book updated successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    success(res, null, 'Book deleted successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const reserveBook = async (req, res) => {
  try {
    const reservation = await bookService.reserveBook(req.user.id, req.params.id);
    success(res, reservation, 'Book reserved successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const reservation = await bookService.cancelReservation(req.params.resId, req.user.id);
    success(res, reservation, 'Reservation cancelled successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const issueBook = async (req, res) => {
  try {
    const { userId } = req.body;
    const transaction = await bookService.issueBook(req.user.id, userId, req.params.id);
    success(res, transaction, 'Book issued successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const returnBook = async (req, res) => {
  try {
    const { userId } = req.body;
    const transaction = await bookService.returnBook(req.user.id, userId, req.params.id);
    success(res, transaction, 'Book returned successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};
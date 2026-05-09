import { BookService } from '../services/BookService.js';

const bookService = new BookService();

export class BookController {
  async addBook(req, res, next) {
    try {
      const book = await bookService.addBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  }

  async editBook(req, res, next) {
    try {
      const book = await bookService.editBook(req.params.id, req.body);
      res.json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  }

  async deleteBook(req, res, next) {
    try {
      await bookService.deleteBook(req.params.id);
      res.json({ success: true, message: 'Book deleted' });
    } catch (err) {
      next(err);
    }
  }

  async searchBooks(req, res, next) {
    try {
      const books = await bookService.searchBooks(req.query.q);
      res.json({ success: true, data: books });
    } catch (err) {
      next(err);
    }
  }
}

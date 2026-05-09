const ApiError = require('../../utils/ApiError');
const bookRepository = require('./book.repository');
const { BOOK_STATUS } = require('../../models/Book');

class BookService {
  async createBook(data) {
    const existing = await bookRepository.findByIsbn(data.isbn);
    if (existing) throw new ApiError(409, 'A book with this ISBN already exists.');

    data.availableCopies = data.totalCopies;
    return bookRepository.create(data);
  }

  async updateBook(id, data) {
    const book = await bookRepository.findById(id);
    if (!book) throw new ApiError(404, 'Book not found.');

    if (data.totalCopies !== undefined) {
      const diff = data.totalCopies - book.totalCopies;
      data.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    return bookRepository.updateById(id, data);
  }

  async deleteBook(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw new ApiError(404, 'Book not found.');
    if (book.availableCopies < book.totalCopies) {
      throw new ApiError(400, 'Cannot delete a book with active borrows.');
    }
    return bookRepository.deleteById(id);
  }

  async getBook(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw new ApiError(404, 'Book not found.');
    return book;
  }

  async getBooks({ page = 1, limit = 20, genre, status, search } = {}) {
    if (search) {
      const skip = (page - 1) * limit;
      const { books, total } = await bookRepository.searchBooks(search, skip, Number(limit));
      return { books, total, page: Number(page), pages: Math.ceil(total / limit) };
    }

    const filter = {};
    if (genre) filter.genre = genre;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      bookRepository.findAll(filter, skip, Number(limit)),
      bookRepository.countAll(filter),
    ]);
    return { books, total, page: Number(page), pages: Math.ceil(total / limit) };
  }

  async syncBookStatus(bookId) {
    const book = await bookRepository.findById(bookId);
    if (!book) return;

    let status = BOOK_STATUS.AVAILABLE;
    if (book.availableCopies === 0) status = BOOK_STATUS.BORROWED;

    await bookRepository.updateStatus(bookId, status);
  }
}

module.exports = new BookService();

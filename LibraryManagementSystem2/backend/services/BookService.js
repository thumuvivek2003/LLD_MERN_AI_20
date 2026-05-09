import { BookRepository } from '../repositories/BookRepository.js';

const bookRepository = new BookRepository();

export class BookService {
  async addBook(data) {
    return bookRepository.create(data);
  }

  async editBook(id, data) {
    return bookRepository.update(id, data);
  }

  async deleteBook(id) {
    return bookRepository.delete(id);
  }

  async searchBooks(query) {
    if (!query) return bookRepository.findAll();
    return bookRepository.search(query);
  }

  async updateCopies(id, delta) {
    const book = await bookRepository.findById(id);
    if (!book) throw new Error('Book not found');
    const newCount = book.availableCopies + delta;
    if (newCount < 0) throw new Error('Not enough copies available');
    return bookRepository.update(id, { availableCopies: newCount });
  }
}

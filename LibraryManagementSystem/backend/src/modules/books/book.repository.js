const Book = require('../../models/Book');

class BookRepository {
  async create(data) {
    return Book.create(data);
  }

  async findById(id) {
    return Book.findById(id);
  }

  async findByIsbn(isbn) {
    return Book.findOne({ isbn });
  }

  async updateById(id, data) {
    return Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Book.findByIdAndDelete(id);
  }

  async findAll(filter = {}, skip = 0, limit = 20, sort = { createdAt: -1 }) {
    return Book.find(filter).skip(skip).limit(limit).sort(sort);
  }

  async countAll(filter = {}) {
    return Book.countDocuments(filter);
  }

  async searchBooks(query, skip = 0, limit = 20) {
    const filter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
      ],
    };
    const [books, total] = await Promise.all([
      Book.find(filter).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);
    return { books, total };
  }

  // Atomic decrement — returns null if no available copies
  async atomicDecrementCopies(bookId) {
    return Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );
  }

  async atomicIncrementCopies(bookId) {
    return Book.findByIdAndUpdate(
      bookId,
      { $inc: { availableCopies: 1 } },
      { new: true }
    );
  }

  async updateStatus(bookId, status) {
    return Book.findByIdAndUpdate(bookId, { status }, { new: true });
  }
}

module.exports = new BookRepository();

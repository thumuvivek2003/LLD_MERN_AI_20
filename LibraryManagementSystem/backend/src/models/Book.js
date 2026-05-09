const mongoose = require('mongoose');

const BOOK_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  BORROWED: 'BORROWED',
  RESERVED: 'RESERVED',
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    author: { type: String, required: true, trim: true, index: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    coverImage: { type: String, default: '' },
    publisher: { type: String, trim: true },
    publishedYear: { type: Number },
    totalCopies: { type: Number, required: true, min: 1, default: 1 },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
    status: {
      type: String,
      enum: Object.values(BOOK_STATUS),
      default: BOOK_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', isbn: 'text', genre: 'text' });

bookSchema.methods.isAvailable = function () {
  return this.availableCopies > 0;
};

module.exports = mongoose.model('Book', bookSchema);
module.exports.BOOK_STATUS = BOOK_STATUS;

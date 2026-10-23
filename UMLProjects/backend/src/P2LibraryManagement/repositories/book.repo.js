import Book from '../models/book.model.js';

export const createBook = async (data) => {
  const book = new Book(data);
  return await book.save();
};

export const findBookById = async (id) => {
  return await Book.findById(id);
};

export const findBooks = async (filter = {}) => {
  return await Book.find(filter);
};

export const updateBook = async (id, data) => {
  return await Book.findByIdAndUpdate(id, data, { new: true });
};

export const updateBookStatus = async (id, status) => {
  return await Book.findByIdAndUpdate(id, { status }, { new: true });
};
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const bookService = require('./book.service');

const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(201).json(new ApiResponse(201, { book }, 'Book created successfully.'));
});

const updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { book }, 'Book updated successfully.'));
});

const deleteBook = asyncHandler(async (req, res) => {
  await bookService.deleteBook(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Book deleted successfully.'));
});

const getBook = asyncHandler(async (req, res) => {
  const book = await bookService.getBook(req.params.id);
  res.status(200).json(new ApiResponse(200, { book }));
});

const getBooks = asyncHandler(async (req, res) => {
  const result = await bookService.getBooks(req.query);
  res.status(200).json(new ApiResponse(200, result));
});

module.exports = { createBook, updateBook, deleteBook, getBook, getBooks };

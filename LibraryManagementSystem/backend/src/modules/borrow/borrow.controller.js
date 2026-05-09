const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const borrowService = require('./borrow.service');

const borrowBook = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const result = await borrowService.borrowBook(req.user._id, bookId);
  res.status(201).json(new ApiResponse(201, { record: result }, 'Book borrowed successfully.'));
});

const returnBook = asyncHandler(async (req, res) => {
  const result = await borrowService.returnBook(req.params.id, req.user._id);
  const message = result.fineAmount > 0
    ? `Book returned. Fine of $${result.fineAmount.toFixed(2)} generated for overdue.`
    : 'Book returned successfully.';
  res.status(200).json(new ApiResponse(200, result, message));
});

const getBorrowHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await borrowService.getBorrowHistory(req.user._id, page, limit);
  res.status(200).json(new ApiResponse(200, result));
});

const getAllActiveBorrows = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await borrowService.getAllActiveBorrows(page, limit);
  res.status(200).json(new ApiResponse(200, result));
});

module.exports = { borrowBook, returnBook, getBorrowHistory, getAllActiveBorrows };

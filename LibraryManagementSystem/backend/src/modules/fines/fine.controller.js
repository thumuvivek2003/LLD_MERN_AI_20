const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const fineService = require('./fine.service');

const getUserFines = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await fineService.getUserFines(req.user._id, page, limit);
  res.status(200).json(new ApiResponse(200, result));
});

const payFine = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const fine = await fineService.payFine(req.params.id, req.user._id, isAdmin);
  res.status(200).json(new ApiResponse(200, { fine }, 'Fine paid successfully.'));
});

const getAllFines = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const result = await fineService.getAllFines(page, limit, status);
  res.status(200).json(new ApiResponse(200, result));
});

module.exports = { getUserFines, payFine, getAllFines };

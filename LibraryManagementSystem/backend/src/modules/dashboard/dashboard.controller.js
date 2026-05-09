const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const dashboardService = require('./dashboard.service');

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  res.status(200).json(new ApiResponse(200, data));
});

module.exports = { getSummary };

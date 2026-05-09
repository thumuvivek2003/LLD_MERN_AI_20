const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const reservationService = require('./reservation.service');

const createReservation = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const reservation = await reservationService.createReservation(req.user._id, bookId);
  res.status(201).json(new ApiResponse(201, { reservation }, 'Reservation created successfully.'));
});

const cancelReservation = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const reservation = await reservationService.cancelReservation(req.params.id, req.user._id, isAdmin);
  res.status(200).json(new ApiResponse(200, { reservation }, 'Reservation cancelled.'));
});

const getUserReservations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await reservationService.getUserReservations(req.user._id, page, limit);
  res.status(200).json(new ApiResponse(200, result));
});

const getAllReservations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const result = await reservationService.getAllReservations(page, limit, status);
  res.status(200).json(new ApiResponse(200, result));
});

module.exports = { createReservation, cancelReservation, getUserReservations, getAllReservations };

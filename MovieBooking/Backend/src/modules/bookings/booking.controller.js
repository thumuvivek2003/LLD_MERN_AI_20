import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './booking.service.js';

export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await service.getUserBookings(req.user.id);
  return successResponse(res, bookings);
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await service.getBooking(req.params.bookingId);
  return successResponse(res, booking);
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await service.createBooking({ ...req.body, userId: req.user.id });
  return successResponse(res, booking, 'Booking confirmed', 201);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await service.cancelBooking(req.params.bookingId, req.user.id);
  return successResponse(res, booking, 'Booking cancelled');
});

import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './seat.service.js';
import { seatLockSchema } from '../../shared/validators/booking.validator.js';

export const getSeatLayout = asyncHandler(async (req, res) => {
  const seats = await service.getSeatLayout(req.params.showId);
  return successResponse(res, seats);
});

export const lockSeats = asyncHandler(async (req, res) => {
  const { showId, seatIds } = req.body;
  const result = await service.lockSeats(showId, seatIds, req.user.id);
  return successResponse(res, result, 'Seats locked');
});

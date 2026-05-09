import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './theater.service.js';

export const getTheaters = asyncHandler(async (req, res) => {
  const theaters = await service.getTheaters(req.query);
  return successResponse(res, theaters);
});

export const getTheater = asyncHandler(async (req, res) => {
  const theater = await service.getTheater(req.params.theaterId);
  return successResponse(res, theater);
});

export const createTheater = asyncHandler(async (req, res) => {
  const theater = await service.createTheater(req.body);
  return successResponse(res, theater, 'Theater created', 201);
});

export const updateTheater = asyncHandler(async (req, res) => {
  const theater = await service.updateTheater(req.params.theaterId, req.body);
  return successResponse(res, theater);
});

export const deleteTheater = asyncHandler(async (req, res) => {
  await service.deleteTheater(req.params.theaterId);
  return successResponse(res, null, 'Theater deleted');
});

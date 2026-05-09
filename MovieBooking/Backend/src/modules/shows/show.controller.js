import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './show.service.js';

export const getShows = asyncHandler(async (req, res) => {
  const shows = await service.getShows(req.query);
  return successResponse(res, shows);
});

export const getShow = asyncHandler(async (req, res) => {
  const show = await service.getShow(req.params.showId);
  return successResponse(res, show);
});

export const getShowsByMovie = asyncHandler(async (req, res) => {
  const shows = await service.getShowsByMovie(req.params.movieId);
  return successResponse(res, shows);
});

export const createShow = asyncHandler(async (req, res) => {
  const show = await service.createShow(req.body);
  return successResponse(res, show, 'Show created', 201);
});

export const updateShow = asyncHandler(async (req, res) => {
  const show = await service.updateShow(req.params.showId, req.body);
  return successResponse(res, show);
});

export const deleteShow = asyncHandler(async (req, res) => {
  await service.deleteShow(req.params.showId);
  return successResponse(res, null, 'Show deleted');
});

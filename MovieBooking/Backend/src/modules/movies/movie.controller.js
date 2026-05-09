import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './movie.service.js';

export const getMovies = asyncHandler(async (req, res) => {
  const movies = await service.getMovies(req.query);
  return successResponse(res, movies);
});

export const getMovie = asyncHandler(async (req, res) => {
  const movie = await service.getMovie(req.params.movieId);
  return successResponse(res, movie);
});

export const createMovie = asyncHandler(async (req, res) => {
  const movie = await service.createMovie(req.body);
  return successResponse(res, movie, 'Movie created', 201);
});

export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await service.updateMovie(req.params.movieId, req.body);
  return successResponse(res, movie);
});

export const deleteMovie = asyncHandler(async (req, res) => {
  await service.deleteMovie(req.params.movieId);
  return successResponse(res, null, 'Movie deleted');
});

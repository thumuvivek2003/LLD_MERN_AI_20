import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './screen.service.js';

export const getScreensByTheater = asyncHandler(async (req, res) => {
  const screens = await service.getScreensByTheater(req.params.theaterId);
  return successResponse(res, screens);
});

export const getScreen = asyncHandler(async (req, res) => {
  const screen = await service.getScreen(req.params.screenId);
  return successResponse(res, screen);
});

export const createScreen = asyncHandler(async (req, res) => {
  const screen = await service.createScreen(req.body);
  return successResponse(res, screen, 'Screen created', 201);
});

export const updateScreen = asyncHandler(async (req, res) => {
  const screen = await service.updateScreen(req.params.screenId, req.body);
  return successResponse(res, screen);
});

export const deleteScreen = asyncHandler(async (req, res) => {
  await service.deleteScreen(req.params.screenId);
  return successResponse(res, null, 'Screen deleted');
});

export const getLayout = asyncHandler(async (req, res) => {
  const layout = await service.getLayout(req.params.screenId);
  return successResponse(res, layout);
});

export const updateLayout = asyncHandler(async (req, res) => {
  const screen = await service.updateLayout(req.params.screenId, req.body.layout);
  return successResponse(res, screen);
});

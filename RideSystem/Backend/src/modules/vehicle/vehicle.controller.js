import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { vehicleService } from './vehicle.service.js';

export const vehicleController = {
  create: asyncHandler(async (req, res) => {
    const vehicle = await vehicleService.create(req.user.id, req.body);
    ApiResponse.created(res, vehicle, 'Vehicle registered');
  }),

  listMine: asyncHandler(async (req, res) => {
    const list = await vehicleService.listMine(req.user.id);
    ApiResponse.ok(res, list);
  }),
};

import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { adminService } from './admin.service.js';
import { UserMapper } from '../user/user.mapper.js';
import { RideMapper } from '../ride/ride.mapper.js';

export const adminController = {
  dashboard: asyncHandler(async (_req, res) => {
    ApiResponse.ok(res, await adminService.dashboard());
  }),
  riders: asyncHandler(async (_req, res) => {
    const list = await adminService.listRiders();
    ApiResponse.ok(res, UserMapper.toList(list));
  }),
  drivers: asyncHandler(async (_req, res) => {
    const list = await adminService.listDrivers();
    ApiResponse.ok(res, UserMapper.toList(list));
  }),
  rides: asyncHandler(async (_req, res) => {
    const rides = await adminService.listRides();
    ApiResponse.ok(res, RideMapper.toList(rides));
  }),
  block: asyncHandler(async (req, res) => {
    const updated = await adminService.setBlocked(req.params.userId, req.body.isBlocked);
    ApiResponse.ok(res, UserMapper.toDto(updated), 'User updated');
  }),
};

import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { driverService } from './driver.service.js';
import { driverLocationService } from './driver-location.service.js';
import { DriverMapper } from './driver.mapper.js';

export const driverController = {
  me: asyncHandler(async (req, res) => {
    const driver = await driverService.getByUser(req.user.id);
    ApiResponse.ok(res, DriverMapper.toDto(driver));
  }),

  setStatus: asyncHandler(async (req, res) => {
    const driver = await driverService.setStatus(req.user.id, req.body.status);
    ApiResponse.ok(res, DriverMapper.toDto(driver), 'Status updated');
  }),

  updateLocation: asyncHandler(async (req, res) => {
    const { lat, lng, rideId, riderId } = req.body;
    await driverLocationService.update(req.user.id, { lat, lng }, rideId, riderId);
    ApiResponse.ok(res, { lat, lng }, 'Location updated');
  }),

  listOnline: asyncHandler(async (_req, res) => {
    const drivers = await driverService.listOnline();
    ApiResponse.ok(res, DriverMapper.toList(drivers));
  }),
};

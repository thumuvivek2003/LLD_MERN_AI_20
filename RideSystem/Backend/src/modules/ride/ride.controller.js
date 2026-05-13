import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { rideService } from './ride.service.js';
import { RideMapper } from './ride.mapper.js';

export const rideController = {
  create: asyncHandler(async (req, res) => {
    const ride = await rideService.create(req.user.id, req.body);
    ApiResponse.created(res, RideMapper.toDto(ride), 'Ride requested');
  }),

  myActive: asyncHandler(async (req, res) => {
    const ride = await rideService.getActiveByRider(req.user.id);
    ApiResponse.ok(res, ride ? RideMapper.toDto(ride) : null);
  }),

  myHistory: asyncHandler(async (req, res) => {
    const rides = await rideService.listByRider(req.user.id);
    ApiResponse.ok(res, RideMapper.toList(rides));
  }),

  driverHistory: asyncHandler(async (req, res) => {
    const rides = await rideService.listByDriver(req.user.id);
    ApiResponse.ok(res, RideMapper.toList(rides));
  }),

  pending: asyncHandler(async (_req, res) => {
    const rides = await rideService.listPending();
    ApiResponse.ok(res, RideMapper.toList(rides));
  }),

  getById: asyncHandler(async (req, res) => {
    const ride = await rideService.getById(req.params.id);
    ApiResponse.ok(res, RideMapper.toDto(ride));
  }),

  accept: asyncHandler(async (req, res) => {
    const ride = await rideService.accept(req.params.id, req.user.id);
    ApiResponse.ok(res, RideMapper.toDriverDto(ride), 'Ride accepted');
  }),

  arrive: asyncHandler(async (req, res) => {
    const ride = await rideService.markArriving(req.params.id, req.user.id);
    ApiResponse.ok(res, RideMapper.toDriverDto(ride), 'Marked arrived');
  }),

  verifyOtp: asyncHandler(async (req, res) => {
    const ride = await rideService.verifyOtp(req.params.id, req.user.id, req.body.otp);
    ApiResponse.ok(res, RideMapper.toDriverDto(ride), 'OTP verified, trip started');
  }),

  complete: asyncHandler(async (req, res) => {
    const ride = await rideService.complete(req.params.id, req.user.id);
    ApiResponse.ok(res, RideMapper.toDto(ride), 'Ride completed');
  }),

  cancel: asyncHandler(async (req, res) => {
    const ride = await rideService.cancel(req.params.id, req.user.id, req.user.role);
    ApiResponse.ok(res, RideMapper.toDto(ride), 'Ride cancelled');
  }),
};

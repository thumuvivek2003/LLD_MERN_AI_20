import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { paymentService } from './payment.service.js';

export const paymentController = {
  pay: asyncHandler(async (req, res) => {
    const payment = await paymentService.pay(req.params.rideId, req.user.id, req.body.method);
    ApiResponse.created(res, payment, 'Payment successful');
  }),

  receiveCash: asyncHandler(async (req, res) => {
    const payment = await paymentService.receiveCash(req.params.rideId, req.user.id);
    ApiResponse.ok(res, payment, 'Cash received');
  }),

  forRide: asyncHandler(async (req, res) => {
    const p = await paymentService.getByRide(req.params.rideId);
    ApiResponse.ok(res, p);
  }),

  driverEarnings: asyncHandler(async (req, res) => {
    const list = await paymentService.listForDriver(req.user.id);
    const total = list.reduce((s, p) => s + (p.amount || 0), 0);
    ApiResponse.ok(res, { total, count: list.length, payments: list });
  }),
};

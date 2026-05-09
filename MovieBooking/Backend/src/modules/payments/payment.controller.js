import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './payment.service.js';

export const processPayment = asyncHandler(async (req, res) => {
  const { amount, method, details } = req.body;
  const payment = await service.processPayment({ userId: req.user.id, amount, method, details });
  return successResponse(res, payment, 'Payment processed');
});

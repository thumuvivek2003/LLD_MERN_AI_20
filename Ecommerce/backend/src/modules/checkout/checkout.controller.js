import { checkoutService } from './checkout.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const checkout = asyncHandler(async (req, res) => {
  const { paymentType, address, paymentDetails } = req.body;
  const result = await checkoutService.checkout(req.user._id, paymentType, address, paymentDetails);
  return successResponse(res, result, 201);
});

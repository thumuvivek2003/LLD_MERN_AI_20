import { productService } from './product.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const getAll = asyncHandler(async (_req, res) => {
  const products = await productService.getProducts();
  return successResponse(res, { products });
});

export const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return successResponse(res, { product });
});

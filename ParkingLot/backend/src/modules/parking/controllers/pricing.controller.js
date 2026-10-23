import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { pricingService } from '../services/pricing.service.js';
import { ValidationError } from '../../../shared/exceptions/validation-error.js';

export class PricingController {
  list(_req, res) {
    return ApiResponse.success(res, pricingService.listStrategies());
  }

  assign(req, res) {
    const { pricingStrategy } = req.body;
    if (!pricingStrategy) throw new ValidationError('pricingStrategy is required');
    return ApiResponse.success(res, pricingService.assignToLot(req.params.parkingLotId, pricingStrategy));
  }
}

export const pricingController = new PricingController();

import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { parkingLotService } from '../services/parking-lot.service.js';
import { validateCreateLot } from '../validators/slot.validator.js';

export class ParkingLotController {
  create(req, res) {
    validateCreateLot(req.body);
    return ApiResponse.success(res, parkingLotService.createLot(req.body), 201);
  }

  list(_req, res) {
    return ApiResponse.success(res, parkingLotService.listLots());
  }

  get(req, res) {
    return ApiResponse.success(res, parkingLotService.summary(req.params.id));
  }
}

export const parkingLotController = new ParkingLotController();

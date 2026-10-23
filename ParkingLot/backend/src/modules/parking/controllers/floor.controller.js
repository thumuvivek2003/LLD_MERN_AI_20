import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { parkingLotService } from '../services/parking-lot.service.js';
import { validateCreateFloor } from '../validators/slot.validator.js';

export class FloorController {
  create(req, res) {
    const dto = { ...req.body, parkingLotId: req.params.parkingLotId };
    validateCreateFloor(dto);
    return ApiResponse.success(res, parkingLotService.createFloor(dto), 201);
  }

  list(req, res) {
    return ApiResponse.success(res, parkingLotService.listFloors(req.params.parkingLotId));
  }
}

export const floorController = new FloorController();

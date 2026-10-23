import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { slotService } from '../services/slot.service.js';
import { SlotMapper } from '../mappers/slot.mapper.js';
import { validateCreateSlot } from '../validators/slot.validator.js';

export class SlotController {
  create(req, res) {
    validateCreateSlot(req.body);
    const slot = slotService.createSlot(req.body);
    return ApiResponse.success(res, SlotMapper.toResponse(slot), 201);
  }

  listByFloor(req, res) {
    const slots = slotService.listByFloor(req.params.floorId).map(SlotMapper.toResponse);
    return ApiResponse.success(res, slots);
  }
}

export const slotController = new SlotController();

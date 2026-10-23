import { Slot } from '../models/slot.model.js';
import { slotRepository } from '../repositories/slot.repository.js';
import { floorRepository } from '../repositories/parking-lot.repository.js';
import { NotFoundError } from '../../../shared/exceptions/not-found-error.js';
import { AppError } from '../../../shared/exceptions/app-error.js';
import { SlotStatus } from '../../../shared/enums/slot-status.enum.js';
import { AvailableState } from '../states/available.state.js';
import { OccupiedState } from '../states/occupied.state.js';
import { MaintenanceState } from '../states/maintenance.state.js';

const stateFor = (status) => {
  switch (status) {
    case SlotStatus.AVAILABLE: return new AvailableState();
    case SlotStatus.OCCUPIED: return new OccupiedState();
    case SlotStatus.MAINTENANCE: return new MaintenanceState();
    default: throw new AppError(`Unknown slot status: ${status}`);
  }
};

export class SlotService {
  createSlot(dto) {
    const floor = floorRepository.findById(dto.floorId);
    if (!floor) throw new NotFoundError('Floor not found');
    return slotRepository.create(new Slot({ ...dto, parkingLotId: floor.parkingLotId }));
  }

  getSlot(id) {
    const slot = slotRepository.findById(id);
    if (!slot) throw new NotFoundError('Slot not found');
    return slot;
  }

  listByFloor(floorId) {
    return slotRepository.findByFloor(floorId);
  }

  occupy(id) {
    const slot = this.getSlot(id);
    slot.status = stateFor(slot.status).occupy();
    return slot;
  }

  free(id) {
    const slot = this.getSlot(id);
    slot.status = stateFor(slot.status).free();
    return slot;
  }
}

export const slotService = new SlotService();

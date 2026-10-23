import { SlotStatus } from '../enums/SlotStatus.js';
import { AvailableState } from '../states/slot/AvailableState.js';
import { OccupiedState } from '../states/slot/OccupiedState.js';
import { MaintenanceState } from '../states/slot/MaintenanceState.js';

const stateFor = (status) => {
  switch (status) {
    case SlotStatus.AVAILABLE: return new AvailableState();
    case SlotStatus.OCCUPIED: return new OccupiedState();
    case SlotStatus.MAINTENANCE: return new MaintenanceState();
    default: throw new Error(`Unknown slot status: ${status}`);
  }
};

export class SlotService {
  constructor(slotRepository) {
    this.slotRepository = slotRepository;
  }

  async create(data) {
    return this.slotRepository.create(data);
  }

  async listByLot(lotId) {
    return this.slotRepository.findByLot(lotId);
  }

  async occupy(slotId) {
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    const next = stateFor(slot.status).occupy();
    return this.slotRepository.updateStatus(slotId, next);
  }

  async release(slotId) {
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    const next = stateFor(slot.status).release();
    return this.slotRepository.updateStatus(slotId, next);
  }

  async markMaintenance(slotId) {
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    const next = stateFor(slot.status).markMaintenance();
    return this.slotRepository.updateStatus(slotId, next);
  }
}

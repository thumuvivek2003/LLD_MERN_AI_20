import { SlotAllocationStrategy } from './SlotAllocationStrategy.js';

export class NearestSlotStrategy extends SlotAllocationStrategy {
  constructor(slotRepository) {
    super();
    this.slotRepository = slotRepository;
  }

  async allocate(lotId, vehicleType) {
    return this.slotRepository.findNearestAvailable(lotId, vehicleType);
  }
}

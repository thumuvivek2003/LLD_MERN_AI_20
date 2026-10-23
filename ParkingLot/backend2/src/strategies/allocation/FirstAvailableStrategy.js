import { SlotAllocationStrategy } from './SlotAllocationStrategy.js';

export class FirstAvailableStrategy extends SlotAllocationStrategy {
  constructor(slotRepository) {
    super();
    this.slotRepository = slotRepository;
  }

  async allocate(lotId, vehicleType) {
    return this.slotRepository.findFirstAvailable(lotId, vehicleType);
  }
}

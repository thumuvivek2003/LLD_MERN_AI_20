import { SlotAllocationStrategy } from './SlotAllocationStrategy.js';

export class RandomSlotStrategy extends SlotAllocationStrategy {
  constructor(slotRepository) {
    super();
    this.slotRepository = slotRepository;
  }

  async allocate(lotId, vehicleType) {
    const slots = await this.slotRepository.findAllAvailable(lotId, vehicleType);
    if (!slots.length) return null;
    return slots[Math.floor(Math.random() * slots.length)];
  }
}

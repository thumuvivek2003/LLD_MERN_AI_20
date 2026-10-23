import { SlotAllocationStrategy } from './slot-allocation.strategy.js';

export class RandomSlotStrategy extends SlotAllocationStrategy {
  allocate(availableSlots) {
    if (!availableSlots.length) return null;
    return availableSlots[Math.floor(Math.random() * availableSlots.length)];
  }
}

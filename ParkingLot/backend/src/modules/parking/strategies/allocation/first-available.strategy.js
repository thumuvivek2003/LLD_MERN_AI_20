import { SlotAllocationStrategy } from './slot-allocation.strategy.js';

export class FirstAvailableStrategy extends SlotAllocationStrategy {
  allocate(availableSlots) {
    return availableSlots[0] ?? null;
  }
}

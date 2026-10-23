import { SlotAllocationStrategy } from './slot-allocation.strategy.js';

export class NearestSlotStrategy extends SlotAllocationStrategy {
  allocate(availableSlots) {
    if (!availableSlots.length) return null;
    return [...availableSlots].sort((a, b) => a.distanceFromEntry - b.distanceFromEntry)[0];
  }
}

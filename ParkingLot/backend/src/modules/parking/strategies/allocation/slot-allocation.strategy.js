export class SlotAllocationStrategy {
  allocate(_availableSlots) {
    throw new Error('SlotAllocationStrategy.allocate must be implemented');
  }
}

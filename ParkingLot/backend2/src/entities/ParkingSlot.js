import { SlotStatus } from '../enums/SlotStatus.js';

export class ParkingSlot {
  constructor({ id, slotNumber, floorId, vehicleType, status = SlotStatus.AVAILABLE }) {
    this.id = id;
    this.slotNumber = slotNumber;
    this.floorId = floorId;
    this.vehicleType = vehicleType;
    this.status = status;
  }

  isAvailable() {
    return this.status === SlotStatus.AVAILABLE;
  }
}

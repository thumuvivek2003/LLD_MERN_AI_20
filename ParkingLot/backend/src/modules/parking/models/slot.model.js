import { SlotStatus } from '../../../shared/enums/slot-status.enum.js';

export class Slot {
  constructor({ id, floorId, parkingLotId, number, vehicleType, status = SlotStatus.AVAILABLE, distanceFromEntry = 0 }) {
    this.id = id;
    this.floorId = floorId;
    this.parkingLotId = parkingLotId;
    this.number = number;
    this.vehicleType = vehicleType;
    this.status = status;
    this.distanceFromEntry = distanceFromEntry;
  }
}

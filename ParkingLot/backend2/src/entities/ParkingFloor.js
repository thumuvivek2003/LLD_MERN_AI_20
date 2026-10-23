export class ParkingFloor {
  constructor({ id, lotId, floorNumber, slots = [] }) {
    this.id = id;
    this.lotId = lotId;
    this.floorNumber = floorNumber;
    this.slots = slots;
  }
}

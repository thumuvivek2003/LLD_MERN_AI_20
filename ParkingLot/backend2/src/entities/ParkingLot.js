export class ParkingLot {
  constructor({ id, name, address, floors = [] }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.floors = floors;
  }
}

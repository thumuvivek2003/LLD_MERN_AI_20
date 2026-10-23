export class Vehicle {
  constructor({ id, plate, type }) {
    this.id = id;
    this.plate = plate;
    this.type = type;
  }
}

export class TwoWheeler extends Vehicle {}
export class FourWheeler extends Vehicle {}
export class HeavyVehicle extends Vehicle {}

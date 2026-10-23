import { Vehicle } from '../entities/Vehicle.js';
import { VehicleType } from '../enums/VehicleType.js';

export class VehicleFactory {
  static create({ licensePlate, type }) {
    if (!Object.values(VehicleType).includes(type)) {
      throw new Error(`Unsupported vehicle type: ${type}`);
    }
    return new Vehicle({ licensePlate, type });
  }
}

import { TwoWheeler, FourWheeler, HeavyVehicle } from '../models/vehicle.model.js';
import { VehicleType } from '../../../shared/enums/vehicle-type.enum.js';
import { ValidationError } from '../../../shared/exceptions/validation-error.js';

export const VehicleFactory = {
  create({ id, plate, type }) {
    switch (type) {
      case VehicleType.TWO_WHEELER: return new TwoWheeler({ id, plate, type });
      case VehicleType.FOUR_WHEELER: return new FourWheeler({ id, plate, type });
      case VehicleType.HEAVY: return new HeavyVehicle({ id, plate, type });
      default: throw new ValidationError(`Unknown vehicle type: ${type}`);
    }
  },
};

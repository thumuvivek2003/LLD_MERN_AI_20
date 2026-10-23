import { ValidationError } from '../../../shared/exceptions/validation-error.js';
import { VehicleType } from '../../../shared/enums/vehicle-type.enum.js';

export const validateEntry = ({ parkingLotId, plate, vehicleType }) => {
  if (!parkingLotId || !plate || !vehicleType) {
    throw new ValidationError('parkingLotId, plate and vehicleType are required');
  }
  if (!Object.values(VehicleType).includes(vehicleType)) {
    throw new ValidationError(`vehicleType must be one of ${Object.values(VehicleType).join(', ')}`);
  }
};

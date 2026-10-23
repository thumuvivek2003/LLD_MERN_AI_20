import { ValidationError } from '../../../shared/exceptions/validation-error.js';
import { VehicleType } from '../../../shared/enums/vehicle-type.enum.js';

export const validateCreateSlot = ({ floorId, number, vehicleType }) => {
  if (!floorId || number == null || !vehicleType) {
    throw new ValidationError('floorId, number and vehicleType are required');
  }
  if (!Object.values(VehicleType).includes(vehicleType)) {
    throw new ValidationError('invalid vehicleType');
  }
};

export const validateCreateFloor = ({ parkingLotId, number }) => {
  if (!parkingLotId || number == null) {
    throw new ValidationError('parkingLotId and number are required');
  }
};

export const validateCreateLot = ({ name }) => {
  if (!name) throw new ValidationError('name is required');
};

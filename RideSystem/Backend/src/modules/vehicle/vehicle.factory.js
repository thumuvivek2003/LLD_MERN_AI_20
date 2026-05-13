import { VEHICLE_TYPE } from '../../config/constants.js';
import { AppError } from '../../core/exceptions/app.error.js';

const DEFAULTS = {
  [VEHICLE_TYPE.BIKE]: { capacity: 1 },
  [VEHICLE_TYPE.MINI]: { capacity: 3 },
  [VEHICLE_TYPE.SEDAN]: { capacity: 4 },
  [VEHICLE_TYPE.SUV]: { capacity: 6 },
};

export const VehicleFactory = {
  create({ owner, type, model, numberPlate, color }) {
    if (!Object.values(VEHICLE_TYPE).includes(type)) {
      throw new AppError(`Unsupported vehicle type: ${type}`, 400);
    }
    return {
      owner,
      type,
      model,
      numberPlate: String(numberPlate || '').toUpperCase().trim(),
      color: color || '',
      ...DEFAULTS[type],
    };
  },
};

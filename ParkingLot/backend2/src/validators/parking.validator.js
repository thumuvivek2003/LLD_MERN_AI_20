import { VehicleType } from '../enums/VehicleType.js';

export const createLotValidator = (body) => {
  if (!body?.name) return 'name is required';
  return null;
};

export const createSlotValidator = (body) => {
  if (!body?.lotId) return 'lotId is required';
  if (body?.floorNumber == null) return 'floorNumber is required';
  if (body?.slotNumber == null) return 'slotNumber is required';
  if (!Object.values(VehicleType).includes(body?.vehicleType)) return 'invalid vehicleType';
  return null;
};

import { VehicleType } from '../enums/VehicleType.js';

export const entryValidator = (body) => {
  if (!body?.lotId) return 'lotId is required';
  if (!body?.licensePlate) return 'licensePlate is required';
  if (!Object.values(VehicleType).includes(body?.vehicleType)) return 'invalid vehicleType';
  return null;
};

export const exitValidator = (body) => {
  if (!body?.ticketNumber) return 'ticketNumber is required';
  return null;
};

import { DRIVER_STATUS } from '../../config/constants.js';

export const validateStatus = (body = {}) => {
  const errors = [];
  if (!body.status || !Object.values(DRIVER_STATUS).includes(body.status)) {
    errors.push('status must be ONLINE, OFFLINE or BUSY');
  }
  return errors;
};

export const validateLocation = (body = {}) => {
  const errors = [];
  if (typeof body.lat !== 'number') errors.push('lat must be a number');
  if (typeof body.lng !== 'number') errors.push('lng must be a number');
  return errors;
};

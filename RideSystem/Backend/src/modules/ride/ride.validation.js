const isLoc = (l) => l && typeof l.lat === 'number' && typeof l.lng === 'number';

export const validateCreateRide = (body = {}) => {
  const errors = [];
  if (!isLoc(body.pickup)) errors.push('pickup {lat,lng} required');
  if (!isLoc(body.drop)) errors.push('drop {lat,lng} required');
  return errors;
};

export const validateOtp = (body = {}) => {
  const errors = [];
  if (!body.otp || String(body.otp).length < 3) errors.push('otp required');
  return errors;
};

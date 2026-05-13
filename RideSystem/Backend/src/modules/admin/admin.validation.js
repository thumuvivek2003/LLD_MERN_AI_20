export const validateBlock = (body = {}) => {
  const errors = [];
  if (typeof body.isBlocked !== 'boolean') errors.push('isBlocked must be a boolean');
  return errors;
};

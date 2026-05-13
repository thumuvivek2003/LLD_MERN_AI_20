export const validateUpdate = (body = {}) => {
  const errors = [];
  if (body.name !== undefined && typeof body.name !== 'string') errors.push('name must be a string');
  if (body.phone !== undefined && typeof body.phone !== 'string') errors.push('phone must be a string');
  return errors;
};

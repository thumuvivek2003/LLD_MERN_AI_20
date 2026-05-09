import { errorResponse } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return errorResponse(res, messages, 422);
  }
  next();
};

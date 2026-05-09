import Joi from 'joi';

export const createBookingSchema = Joi.object({
  showId: Joi.string().required(),
  seatIds: Joi.array().items(Joi.string()).min(1).required(),
  paymentId: Joi.string().required(),
});

export const seatLockSchema = Joi.object({
  showId: Joi.string().required(),
  seatIds: Joi.array().items(Joi.string()).min(1).required(),
});

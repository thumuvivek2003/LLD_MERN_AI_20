import Joi from 'joi';

export const createShowSchema = Joi.object({
  movieId: Joi.string().required(),
  screenId: Joi.string().required(),
  theaterId: Joi.string().required(),
  date: Joi.string().required(),
  startTime: Joi.string().required(),
  basePrice: Joi.number().min(0).required(),
  premiumPrice: Joi.number().min(0),
});

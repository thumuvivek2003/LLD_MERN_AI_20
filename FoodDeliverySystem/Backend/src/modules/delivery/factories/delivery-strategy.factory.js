import { NearestPartnerStrategy } from '../strategies/nearest-partner.strategy.js';
import { BestRatedStrategy } from '../strategies/best-rated.strategy.js';
import { DELIVERY_ASSIGNMENT_TYPES } from '../../../core/constants/delivery.constants.js';
import { BadRequestError } from '../../../core/errors/bad-request.error.js';

const registry = {
  [DELIVERY_ASSIGNMENT_TYPES.NEAREST]: new NearestPartnerStrategy(),
  [DELIVERY_ASSIGNMENT_TYPES.BEST_RATED]: new BestRatedStrategy(),
};

export const getAssignmentStrategy = (type = DELIVERY_ASSIGNMENT_TYPES.NEAREST) => {
  const s = registry[type];
  if (!s) throw new BadRequestError(`Unknown assignment strategy: ${type}`);
  return s;
};

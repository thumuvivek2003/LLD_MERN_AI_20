import { hoursBetween } from './time.util.js';

export const calculateFare = (pricingStrategy, ticket, vehicleType, exitMs = Date.now()) => {
  const duration = hoursBetween(new Date(ticket.entryAt).getTime(), exitMs);
  return pricingStrategy.calculate(duration, vehicleType);
};

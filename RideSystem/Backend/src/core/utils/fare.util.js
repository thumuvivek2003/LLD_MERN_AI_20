import { FARE } from '../../config/constants.js';

export function calculateFare(distanceKm) {
  const km = Math.max(0, Number(distanceKm) || 0);
  return Math.round(FARE.BASE + km * FARE.PER_KM);
}

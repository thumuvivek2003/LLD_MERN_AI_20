import { buildRestaurantDto } from './restaurant.dto.js';

export const toRestaurantDto = (r, distanceKm) => {
  if (!r) return null;
  const dto = buildRestaurantDto(r);
  if (typeof distanceKm === 'number') dto.distanceKm = Number(distanceKm.toFixed(2));
  return dto;
};

export const toRestaurantDtoList = (rs = []) => rs.map((r) => toRestaurantDto(r));

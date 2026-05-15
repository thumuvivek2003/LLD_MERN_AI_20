import { AppError } from "../../../shared/errors/AppError.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

export function validateCreateHallRequest(body) {
  const { sourceFloor, direction, destinationFloor } = body || {};

  if (sourceFloor === undefined || sourceFloor === null || Number.isNaN(Number(sourceFloor))) {
    throw new AppError("sourceFloor is required and must be a number", 400);
  }
  if (![DIRECTION.UP, DIRECTION.DOWN].includes(direction)) {
    throw new AppError("direction must be UP or DOWN", 400);
  }
  const dest =
    destinationFloor === undefined || destinationFloor === null
      ? null
      : Number(destinationFloor);
  if (dest !== null && Number.isNaN(dest)) {
    throw new AppError("destinationFloor must be a number when provided", 400);
  }
  return {
    sourceFloor: Number(sourceFloor),
    direction,
    destinationFloor: dest,
  };
}

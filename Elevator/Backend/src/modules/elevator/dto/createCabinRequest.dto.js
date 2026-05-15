import { AppError } from "../../../shared/errors/AppError.js";

export function validateCreateCabinRequest(body) {
  const { elevatorId, destinationFloor } = body || {};
  if (!elevatorId || typeof elevatorId !== "string") {
    throw new AppError("elevatorId is required", 400);
  }
  if (destinationFloor === undefined || destinationFloor === null || Number.isNaN(Number(destinationFloor))) {
    throw new AppError("destinationFloor is required and must be a number", 400);
  }
  return {
    elevatorId,
    destinationFloor: Number(destinationFloor),
  };
}

import { AppError } from "../../../core/errors/AppError.js";

export function insertCardDTO(body) {
  if (!body?.cardNumber) throw new AppError("cardNumber is required", 400, "VALIDATION_ERROR");
  return { cardNumber: String(body.cardNumber).trim() };
}

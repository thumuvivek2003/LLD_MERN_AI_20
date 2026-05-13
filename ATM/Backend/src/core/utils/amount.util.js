import { MIN_WITHDRAW_MULTIPLE } from "../constants/denomination.constants.js";
import { AppError } from "../errors/AppError.js";

export function validateDenominationAmount(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) {
    throw new AppError("Amount must be a positive number", 400, "INVALID_AMOUNT");
  }
  if (n % MIN_WITHDRAW_MULTIPLE !== 0) {
    throw new AppError(`Amount must be a multiple of ${MIN_WITHDRAW_MULTIPLE}`, 400, "INVALID_AMOUNT");
  }
  return n;
}

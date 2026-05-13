import { AppError } from "./AppError.js";

export class InsufficientATMCashError extends AppError {
  constructor(message = "ATM does not have sufficient cash for this amount") {
    super(message, 400, "INSUFFICIENT_ATM_CASH");
  }
}

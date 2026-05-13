import { AppError } from "./AppError.js";

export class InsufficientBalanceError extends AppError {
  constructor(message = "Insufficient account balance") {
    super(message, 400, "INSUFFICIENT_BALANCE");
  }
}

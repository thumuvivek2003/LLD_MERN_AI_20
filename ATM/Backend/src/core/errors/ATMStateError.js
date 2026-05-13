import { AppError } from "./AppError.js";

export class ATMStateError extends AppError {
  constructor(message = "Invalid ATM state for this operation", code = "INVALID_STATE") {
    super(message, 409, code);
  }
}

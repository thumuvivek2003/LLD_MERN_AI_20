import { AppError } from "./AppError.js";

export class CardBlockedError extends AppError {
  constructor(message = "Card is blocked. Please contact your bank.", details = { attemptsLeft: 0, blocked: true }) {
    super(message, 403, "CARD_BLOCKED", details);
  }
}

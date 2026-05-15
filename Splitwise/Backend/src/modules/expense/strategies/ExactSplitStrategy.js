import { SplitStrategy } from "./SplitStrategy.js";
import { AppError } from "../../../core/errors/AppError.js";
import { roundAmount, amountsApproxEqual } from "../../../core/utils/amount.util.js";

export class ExactSplitStrategy extends SplitStrategy {
  calculateShares(amount, participants, input) {
    if (!input || typeof input.amounts !== "object" || input.amounts === null) {
      throw new AppError("INVALID_SPLIT", 400, "splitInput.amounts is required for EXACT split");
    }
    if (!Array.isArray(participants) || participants.length === 0) {
      throw new AppError("INVALID_SPLIT", 400, "At least one participant is required");
    }

    const shares = participants.map((userId) => {
      if (!(userId in input.amounts)) {
        throw new AppError("INVALID_SPLIT", 400, `Missing exact amount for user ${userId}`);
      }
      const value = Number(input.amounts[userId]);
      if (!Number.isFinite(value) || value < 0) {
        throw new AppError("INVALID_SPLIT", 400, `Invalid amount for user ${userId}`);
      }
      return { userId, amount: roundAmount(value) };
    });

    const sum = shares.reduce((acc, s) => acc + s.amount, 0);
    if (!amountsApproxEqual(sum, amount, 0.01)) {
      throw new AppError(
        "INVALID_SPLIT",
        400,
        `Exact amounts (${roundAmount(sum)}) must sum to total (${roundAmount(amount)})`
      );
    }
    return shares;
  }
}

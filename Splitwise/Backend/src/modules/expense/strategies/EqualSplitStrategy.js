import { SplitStrategy } from "./SplitStrategy.js";
import { AppError } from "../../../core/errors/AppError.js";
import { roundAmount, distributeRemainder } from "../../../core/utils/amount.util.js";

export class EqualSplitStrategy extends SplitStrategy {
  calculateShares(amount, participants) {
    if (!Array.isArray(participants) || participants.length === 0) {
      throw new AppError("INVALID_SPLIT", 400, "At least one participant is required");
    }
    const per = amount / participants.length;
    const shares = participants.map((userId) => ({
      userId,
      amount: roundAmount(per),
    }));
    return distributeRemainder(shares, amount);
  }
}

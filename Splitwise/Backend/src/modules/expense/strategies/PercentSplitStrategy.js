import { SplitStrategy } from "./SplitStrategy.js";
import { AppError } from "../../../core/errors/AppError.js";
import { roundAmount, distributeRemainder, amountsApproxEqual } from "../../../core/utils/amount.util.js";

export class PercentSplitStrategy extends SplitStrategy {
  calculateShares(amount, participants, input) {
    if (!input || typeof input.percents !== "object" || input.percents === null) {
      throw new AppError("INVALID_SPLIT", 400, "splitInput.percents is required for PERCENT split");
    }
    if (!Array.isArray(participants) || participants.length === 0) {
      throw new AppError("INVALID_SPLIT", 400, "At least one participant is required");
    }

    const percents = participants.map((userId) => {
      if (!(userId in input.percents)) {
        throw new AppError("INVALID_SPLIT", 400, `Missing percent for user ${userId}`);
      }
      const value = Number(input.percents[userId]);
      if (!Number.isFinite(value) || value < 0) {
        throw new AppError("INVALID_SPLIT", 400, `Invalid percent for user ${userId}`);
      }
      return { userId, percent: value };
    });

    const totalPct = percents.reduce((acc, p) => acc + p.percent, 0);
    if (!amountsApproxEqual(totalPct, 100, 0.01)) {
      throw new AppError("INVALID_SPLIT", 400, `Percentages must sum to 100 (got ${totalPct})`);
    }

    const shares = percents.map(({ userId, percent }) => ({
      userId,
      amount: roundAmount((amount * percent) / 100),
    }));
    return distributeRemainder(shares, amount);
  }
}

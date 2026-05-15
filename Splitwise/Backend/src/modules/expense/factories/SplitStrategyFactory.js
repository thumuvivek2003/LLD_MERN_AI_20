import { EqualSplitStrategy } from "../strategies/EqualSplitStrategy.js";
import { ExactSplitStrategy } from "../strategies/ExactSplitStrategy.js";
import { PercentSplitStrategy } from "../strategies/PercentSplitStrategy.js";
import { AppError } from "../../../core/errors/AppError.js";

export class SplitStrategyFactory {
  static createStrategy(splitType) {
    switch (splitType) {
      case "EQUAL":
        return new EqualSplitStrategy();
      case "EXACT":
        return new ExactSplitStrategy();
      case "PERCENT":
        return new PercentSplitStrategy();
      default:
        throw new AppError("VALIDATION_ERROR", 400, `Unknown splitType: ${splitType}`);
    }
  }
}

import { AppError } from "../errors/AppError.js";

export function validateRequest(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter((f) => req.body?.[f] === undefined || req.body?.[f] === null || req.body?.[f] === "");
    if (missing.length > 0) {
      return next(new AppError(`Missing required fields: ${missing.join(", ")}`, 400, "VALIDATION_ERROR"));
    }
    next();
  };
}

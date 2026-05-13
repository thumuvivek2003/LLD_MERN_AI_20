import { AppError } from "../../../core/errors/AppError.js";

export function withdrawDTO(body) {
  if (!body?.sessionId) throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  if (body?.amount === undefined || body?.amount === null) {
    throw new AppError("amount is required", 400, "VALIDATION_ERROR");
  }
  return { sessionId: String(body.sessionId), amount: Number(body.amount) };
}

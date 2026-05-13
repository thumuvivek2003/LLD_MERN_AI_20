import { AppError } from "../../../core/errors/AppError.js";

export function enterPinDTO(body) {
  if (!body?.sessionId) throw new AppError("sessionId is required", 400, "VALIDATION_ERROR");
  if (!body?.pin) throw new AppError("pin is required", 400, "VALIDATION_ERROR");
  return { sessionId: String(body.sessionId), pin: String(body.pin) };
}

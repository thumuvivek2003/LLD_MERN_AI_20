import { AppError } from "../errors/AppError.js";

export function globalErrorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    const body = {
      success: false,
      code: err.code,
      message: err.message,
    };
    if (err.details && typeof err.details === "object") {
      Object.assign(body, err.details);
    }
    return res.status(err.statusCode).json(body);
  }

  console.error("[error]", err);
  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: err.message || "Something went wrong",
  });
}

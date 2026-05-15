import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const checkHealth = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

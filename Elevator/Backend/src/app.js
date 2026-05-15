import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { registerElevatorRoutes } from "./modules/elevator/routes/elevator.routes.js";
import { registerHealthRoutes } from "./modules/health/health.routes.js";
import { AppError } from "./shared/errors/AppError.js";
import { logger } from "./shared/utils/logger.js";

export function bootstrapApplication() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  registerHealthRoutes(app);
  registerElevatorRoutes(app);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  app.use((err, _req, res, _next) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    if (status >= 500) logger.error(err.stack || err.message);
    res.status(status).json({ success: false, message: err.message || "Internal error" });
  });

  return app;
}

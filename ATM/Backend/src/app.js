import express from "express";
import cors from "cors";
import { env } from "./config/env.config.js";
import { requestLogger } from "./core/middlewares/requestLogger.middleware.js";
import { globalErrorHandler } from "./core/middlewares/error.middleware.js";
import { registerRoutes } from "./routes/index.js";

export function createApp() {
  const app = express();

  // app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use("/api", registerRoutes());

  app.use((req, res) => {
    res.status(404).json({ success: false, code: "NOT_FOUND", message: `Route ${req.originalUrl} not found` });
  });

  app.use(globalErrorHandler);

  return app;
}

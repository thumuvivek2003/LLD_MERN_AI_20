import { Router } from "express";
import { checkHealth } from "./health.controller.js";

export function registerHealthRoutes(app) {
  const router = Router();
  router.get("/", checkHealth);
  app.use("/api/health", router);
}

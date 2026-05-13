import { Router } from "express";
import { registerATMRoutes } from "../modules/atm/routes/atm.routes.js";

export function registerRoutes() {
  const router = Router();

  router.get("/health", (req, res) => res.json({ status: "ok", service: "atm-backend" }));
  router.use("/atm", registerATMRoutes());

  return router;
}

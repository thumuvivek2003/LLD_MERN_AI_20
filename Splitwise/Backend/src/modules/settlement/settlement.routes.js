import { Router } from "express";
import * as settlementController from "./settlement.controller.js";

export function registerSettlementRoutes() {
  const router = Router({ mergeParams: true });

  router.post("/", settlementController.settleUp);
  router.get("/", settlementController.getSettlementHistory);

  return router;
}

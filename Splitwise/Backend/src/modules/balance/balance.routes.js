import { Router } from "express";
import * as balanceController from "./balance.controller.js";

export function registerBalanceRoutes() {
  const router = Router({ mergeParams: true });

  router.get("/", balanceController.getBalances);
  router.get("/simplified", balanceController.getSimplifiedDebts);

  return router;
}

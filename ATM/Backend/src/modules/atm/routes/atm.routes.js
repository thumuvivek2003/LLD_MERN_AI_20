import { Router } from "express";
import * as atmController from "../controllers/atm.controller.js";
import { validateRequest } from "../../../core/middlewares/validate.middleware.js";

export function registerATMRoutes() {
  const router = Router();

  router.get("/cards", atmController.listCards);

  router.post("/insert-card", validateRequest(["cardNumber"]), atmController.insertCard);
  router.post("/enter-pin", validateRequest(["sessionId", "pin"]), atmController.enterPin);
  router.post("/select-operation", validateRequest(["sessionId"]), atmController.selectOperation);
  router.post("/balance", validateRequest(["sessionId"]), atmController.checkBalance);
  router.post("/withdraw/preview", validateRequest(["sessionId", "amount"]), atmController.previewWithdraw);
  router.post("/withdraw/confirm", validateRequest(["sessionId", "amount"]), atmController.withdrawCash);
  router.post("/collect-cash", validateRequest(["sessionId"]), atmController.collectCash);
  router.post("/eject-card", validateRequest(["sessionId"]), atmController.ejectCard);

  router.get("/session/:sessionId", atmController.getSession);

  return router;
}

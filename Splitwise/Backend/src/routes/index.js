import { Router } from "express";
import { registerUserRoutes } from "../modules/user/user.routes.js";
import { registerGroupRoutes } from "../modules/group/group.routes.js";
import {
  registerGroupExpenseRoutes,
  registerExpenseRoutes,
} from "../modules/expense/expense.routes.js";
import { registerSettlementRoutes } from "../modules/settlement/settlement.routes.js";
import { registerBalanceRoutes } from "../modules/balance/balance.routes.js";

export function registerRoutes() {
  const router = Router();

  router.get("/health", (req, res) =>
    res.json({ status: "ok", service: "splitwise-backend" })
  );

  router.use("/users", registerUserRoutes());
  router.use("/groups", registerGroupRoutes());

  router.use("/groups/:groupId/expenses", registerGroupExpenseRoutes());
  router.use("/groups/:groupId/settlements", registerSettlementRoutes());
  router.use("/groups/:groupId/balances", registerBalanceRoutes());

  router.use("/expenses", registerExpenseRoutes());

  return router;
}

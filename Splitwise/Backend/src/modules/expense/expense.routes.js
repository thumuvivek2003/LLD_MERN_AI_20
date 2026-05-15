import { Router } from "express";
import * as expenseController from "./expense.controller.js";

export function registerGroupExpenseRoutes() {
  const router = Router({ mergeParams: true });
  router.post("/", expenseController.addExpense);
  router.get("/", expenseController.getGroupExpenses);
  return router;
}

export function registerExpenseRoutes() {
  const router = Router();
  router.get("/:expenseId", expenseController.getExpense);
  router.patch("/:expenseId", expenseController.updateExpense);
  router.delete("/:expenseId", expenseController.deleteExpense);
  return router;
}

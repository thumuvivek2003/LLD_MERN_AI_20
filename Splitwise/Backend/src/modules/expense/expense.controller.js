import * as expenseService from "./expense.service.js";
import { successResponse } from "../../core/utils/response.util.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";

export const addExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.addExpense(req.params.groupId, req.body || {});
  successResponse(res, { expense }, 201);
});

export const getGroupExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.listGroupExpenses(req.params.groupId);
  successResponse(res, { expenses });
});

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpense(req.params.expenseId);
  successResponse(res, { expense });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.expenseId, req.body || {});
  successResponse(res, { expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.expenseId);
  successResponse(res, { success: true });
});

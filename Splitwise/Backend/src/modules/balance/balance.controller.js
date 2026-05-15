import * as balanceService from "./balance.service.js";
import { successResponse } from "../../core/utils/response.util.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";

export const getBalances = asyncHandler(async (req, res) => {
  const balances = await balanceService.generateBalances(req.params.groupId);
  successResponse(res, { balances });
});

export const getSimplifiedDebts = asyncHandler(async (req, res) => {
  const debts = await balanceService.getSimplifiedDebts(req.params.groupId);
  successResponse(res, { debts });
});

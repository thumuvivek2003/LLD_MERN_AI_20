import * as settlementService from "./settlement.service.js";
import { successResponse } from "../../core/utils/response.util.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";

export const settleUp = asyncHandler(async (req, res) => {
  const settlement = await settlementService.settleUp(req.params.groupId, req.body || {});
  successResponse(res, { settlement }, 201);
});

export const getSettlementHistory = asyncHandler(async (req, res) => {
  const settlements = await settlementService.getSettlementHistory(req.params.groupId);
  successResponse(res, { settlements });
});

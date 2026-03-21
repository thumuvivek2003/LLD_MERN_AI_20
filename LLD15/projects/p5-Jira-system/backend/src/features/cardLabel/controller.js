import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  addLabelService,
  removeLabelService,
  getLabelsByCardService,
} from "./service.js";

export const addLabel = asyncHandler(async (req, res) => {
  const data = await addLabelService(req.body);
  successResponse(res, data);
});

export const removeLabel = asyncHandler(async (req, res) => {
  await removeLabelService(req.body.cardId, req.body.labelId);
  successResponse(res, null, "Removed");
});

export const getLabels = asyncHandler(async (req, res) => {
  const data = await getLabelsByCardService(req.params.cardId);
  successResponse(res, data);
});
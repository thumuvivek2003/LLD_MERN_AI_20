import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createLabelService,
  getLabelsService,
} from "./service.js";

export const createLabel = asyncHandler(async (req, res) => {
  const data = await createLabelService(req.body);
  successResponse(res, data);
});

export const getLabels = asyncHandler(async (req, res) => {
  const data = await getLabelsService(req.params.boardId);
  successResponse(res, data);
});
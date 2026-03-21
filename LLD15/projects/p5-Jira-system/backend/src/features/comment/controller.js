import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  addCommentService,
  getCommentsService,
} from "./service.js";

export const addComment = asyncHandler(async (req, res) => {
  const data = await addCommentService(req.body);
  successResponse(res, data);
});

export const getComments = asyncHandler(async (req, res) => {
  const data = await getCommentsService(req.params.cardId);
  successResponse(res, data);
});
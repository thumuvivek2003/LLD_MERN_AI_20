import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  addColumnService,
  updateColumnService,
  deleteColumnService,
  getColumnsService,
} from "./service.js";

export const addColumn = asyncHandler(async (req, res) => {
  const data = await addColumnService(req.body);
  successResponse(res, data);
});

export const updateColumn = asyncHandler(async (req, res) => {
  const data = await updateColumnService(req.params.id, req.body);
  successResponse(res, data);
});

export const deleteColumn = asyncHandler(async (req, res) => {
  await deleteColumnService(req.params.id);
  successResponse(res, null, "Deleted");
});

export const getColumns = asyncHandler(async (req, res) => {
  const data = await getColumnsService(req.params.boardId);
  successResponse(res, data);
});
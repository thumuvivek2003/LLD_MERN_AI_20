import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createBoardService,
  updateBoardService,
  deleteBoardService,
  getBoardsService,
} from "./service.js";

export const createBoard = asyncHandler(async (req, res) => {
  const board = await createBoardService(req.body);
  successResponse(res, board, "Board created");
});

export const updateBoard = asyncHandler(async (req, res) => {
  const board = await updateBoardService(req.params.id, req.body);
  successResponse(res, board);
});

export const deleteBoard = asyncHandler(async (req, res) => {
  await deleteBoardService(req.params.id);
  successResponse(res, null, "Board deleted");
});

export const getBoards = asyncHandler(async (req, res) => {
  const boards = await getBoardsService(req.params.userId);
  successResponse(res, boards);
});
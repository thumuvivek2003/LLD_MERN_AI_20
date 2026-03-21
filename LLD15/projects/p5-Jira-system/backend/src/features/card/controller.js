import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createCardService,
  updateCardService,
  deleteCardService,
  moveCardService,
} from "./service.js";

export const createCard = asyncHandler(async (req, res) => {
  const data = await createCardService(req.body);
  successResponse(res, data);
});

export const updateCard = asyncHandler(async (req, res) => {
  const data = await updateCardService(req.params.id, req.body);
  successResponse(res, data);
});

export const deleteCard = asyncHandler(async (req, res) => {
  await deleteCardService(req.params.id);
  successResponse(res, null, "Deleted");
});

export const moveCard = asyncHandler(async (req, res) => {
  const { cardId, newColumnId, newPosition } = req.body;
  const data = await moveCardService(cardId, newColumnId, newPosition);
  successResponse(res, data);
});
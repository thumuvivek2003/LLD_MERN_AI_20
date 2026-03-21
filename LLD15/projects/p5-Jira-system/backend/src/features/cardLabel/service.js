import {
  addLabelRepo,
  removeLabelRepo,
  getLabelsByCardRepo,
} from "./repository.js";

export const addLabelService = (data) =>
  addLabelRepo(data);

export const removeLabelService = (cardId, labelId) =>
  removeLabelRepo(cardId, labelId);

export const getLabelsByCardService = (cardId) =>
  getLabelsByCardRepo(cardId);
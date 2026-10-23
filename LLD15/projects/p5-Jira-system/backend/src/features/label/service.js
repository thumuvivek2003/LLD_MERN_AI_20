import {
  createLabelRepo,
  getLabelsRepo,
} from "./repository.js";

export const createLabelService = (data) =>
  createLabelRepo(data);

export const getLabelsService = (boardId) =>
  getLabelsRepo(boardId);
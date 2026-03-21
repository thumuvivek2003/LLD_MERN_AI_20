import {
  addCommentRepo,
  getCommentsRepo,
} from "./repository.js";

export const addCommentService = (data) =>
  addCommentRepo(data);

export const getCommentsService = (cardId) =>
  getCommentsRepo(cardId);
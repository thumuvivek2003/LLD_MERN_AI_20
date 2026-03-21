import Comment from "./model.js";

export const addCommentRepo = (data) =>
  Comment.create(data);

export const getCommentsRepo = (cardId) =>
  Comment.find({ cardId }).sort({ createdAt: 1 });
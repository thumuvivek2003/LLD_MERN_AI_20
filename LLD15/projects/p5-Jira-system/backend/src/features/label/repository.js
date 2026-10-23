import Label from "./model.js";

export const createLabelRepo = (data) =>
  Label.create(data);

export const getLabelsRepo = (boardId) =>
  Label.find({ boardId });
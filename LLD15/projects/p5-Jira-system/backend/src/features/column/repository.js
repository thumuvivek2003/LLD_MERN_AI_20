import Column from "./model.js";

export const createColumnRepo = (data) =>
  Column.create(data);

export const updateColumnRepo = (id, data) =>
  Column.findByIdAndUpdate(id, data, { new: true });

export const deleteColumnRepo = (id) =>
  Column.findByIdAndDelete(id);

export const getColumnsRepo = (boardId) =>
  Column.find({ boardId }).sort({ order: 1 });
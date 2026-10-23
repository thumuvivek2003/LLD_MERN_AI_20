import {
  createColumnRepo,
  updateColumnRepo,
  deleteColumnRepo,
  getColumnsRepo,
} from "./repository.js";

export const addColumnService = async ({ boardId, name }) => {
  const order = Date.now(); // simple ordering
  return createColumnRepo({ boardId, name, order });
};

export const updateColumnService = (id, data) =>
  updateColumnRepo(id, data);

export const deleteColumnService = (id) =>
  deleteColumnRepo(id);

export const getColumnsService = (boardId) =>
  getColumnsRepo(boardId);
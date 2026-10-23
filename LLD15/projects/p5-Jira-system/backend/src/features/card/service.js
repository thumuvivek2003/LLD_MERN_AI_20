import {
  createCardRepo,
  updateCardRepo,
  deleteCardRepo,
} from "./repository.js";

export const createCardService = async ({ columnId, title, description }) => {
  const position = Date.now();
  return createCardRepo({ columnId, title, description, position });
};

export const updateCardService = (id, data) =>
  updateCardRepo(id, data);

export const deleteCardService = (id) =>
  deleteCardRepo(id);

export const moveCardService = (cardId, newColumnId, newPosition) =>
  updateCardRepo(cardId, {
    columnId: newColumnId,
    position: newPosition,
  });
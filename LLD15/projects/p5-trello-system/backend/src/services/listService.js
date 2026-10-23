import * as listRepo from "../repositories/listRepository.js";

export const createList = async (boardId, title) => {

  const lists = await listRepo.getListsByBoard(boardId);
  const position = lists.length + 1;

  return listRepo.createList({
    boardId,
    title,
    position
  });
};

export const getLists = (boardId) => {
  return listRepo.getListsByBoard(boardId);
};

export const updateList = (id, data) => {
  return listRepo.updateList(id, data);
};

export const deleteList = (id) => {
  return listRepo.deleteList(id);
};
import * as boardRepo from "../repositories/boardRepository.js";

export const createBoard = async (userId, title) => {
  return boardRepo.createBoard({
    title,
    ownerId: userId
  });
};

export const getBoards = async (userId) => {
  return boardRepo.getBoardsByUser(userId);
};

export const getBoardById = async (boardId, userId) => {
  return await boardRepo.findBoardById(boardId);
};


export const deleteBoard = async (boardId) => {
  return boardRepo.deleteBoard(boardId);
};
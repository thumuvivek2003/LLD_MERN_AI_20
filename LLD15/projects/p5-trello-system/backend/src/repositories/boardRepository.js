import Board from "../models/Board.js";

export const createBoard = (data) => {
  return Board.create(data);
};

export const getBoardsByUser = (userId) => {
  return Board.find({ ownerId: userId });
};

export const deleteBoard = (boardId) => {
  return Board.findByIdAndDelete(boardId);
};

export const  findBoardById = (boardId) => {
    return Board.findById(boardId);
}
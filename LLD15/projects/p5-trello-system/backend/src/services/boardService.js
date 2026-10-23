import * as boardRepo from "../repositories/boardRepository.js";
import { getCardsByList, getCardsByListIds } from "../repositories/cardRepository.js";
import { getListsByBoard } from "../repositories/listRepository.js";

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

export const getBoardListCards = async (boardId, userId) => {

  // 1️⃣ Validate board access
  const board = await boardRepo.findBoardById(boardId);
  if (!board) {
    throw new Error("Board not found");
  }
  // if (board.ownerId.toString() !== userId) {
  //   throw new Error("Unauthorized");
  // }
  // 2️⃣ Get lists
  const lists = await getListsByBoard(boardId)
  const listIds = lists.map(l => l._id);

  // 3️⃣ Get cards
  const cards = await getCardsByListIds(listIds);

  // 4️⃣ Group cards by listId
  const cardsByList = {};
  for (const card of cards) {
    const key = card.listId.toString();
    if (!cardsByList[key]) {
      cardsByList[key] = [];
    }
    cardsByList[key].push({
      id: card._id,
      title: card.title
    });
  }
  // 5️⃣ Attach cards to lists
  const result = lists.map(list => ({
    id: list._id,
    title: list.title,
    cards: cardsByList[list._id.toString()] || []
  }));
  return result;
};
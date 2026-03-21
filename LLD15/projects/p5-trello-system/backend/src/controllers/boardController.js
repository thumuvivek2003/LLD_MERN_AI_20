import * as boardService from "../services/boardService.js";

export const createBoard = async (req, res) => {

  const board = await boardService.createBoard(
    req.user.id,
    req.body.title
  );

  res.status(201).json(board);
};

export const getBoards = async (req, res) => {

  const boards = await boardService.getBoards(req.user.id);

  res.json(boards);
};

export const getBoardById = async (req, res) => {
  try {
    const boardId = req.params.id;

    const board = await boardService.getBoardById(
      boardId,
      req.user.id
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBoard = async (req, res) => {

  await boardService.deleteBoard(req.params.id);

  res.json({ message: "Board deleted" });
};


export const getBoardListCards = async (req, res) => {
  const data = await boardService.getBoardListCards(req.params.id);
  res.json(data);
};
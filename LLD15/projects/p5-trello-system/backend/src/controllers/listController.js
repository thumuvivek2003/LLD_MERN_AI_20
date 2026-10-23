import * as listService from "../services/listService.js";

export const createList = async (req, res) => {

  const list = await listService.createList(
    req.params.boardId,
    req.body.title
  );

  res.status(201).json(list);
};

export const getLists = async (req, res) => {

  const lists = await listService.getLists(req.params.boardId);

  res.json(lists);
};

export const updateList = async (req, res) => {

  const list = await listService.updateList(req.params.id, req.body);

  res.json(list);
};

export const deleteList = async (req, res) => {

  await listService.deleteList(req.params.id);

  res.json({ message: "List deleted" });
};

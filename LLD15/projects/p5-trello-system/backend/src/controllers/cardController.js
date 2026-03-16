import * as cardService from "../services/cardService.js";

export const createCard = async (req, res) => {

  const card = await cardService.createCard(
    req.params.listId,
    req.body.title
  );

  res.status(201).json(card);
};

export const getCards = async (req, res) => {

  const cards = await cardService.getCards(req.params.listId);

  res.json(cards);
};

export const updateCard = async (req, res) => {

  const card = await cardService.updateCard(req.params.id, req.body);

  res.json(card);
};

export const deleteCard = async (req, res) => {

  await cardService.deleteCard(req.params.id);

  res.json({ message: "Card deleted" });
};

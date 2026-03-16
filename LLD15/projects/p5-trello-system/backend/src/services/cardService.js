import * as cardRepo from "../repositories/cardRepository.js";

export const createCard = async (listId, title) => {

  const cards = await cardRepo.getCardsByList(listId);
  const position = cards.length + 1;

  return cardRepo.createCard({
    listId,
    title,
    position
  });
};

export const getCards = (listId) => {
  return cardRepo.getCardsByList(listId);
};

export const updateCard = (id, data) => {
  return cardRepo.updateCard(id, data);
};

export const deleteCard = (id) => {
  return cardRepo.deleteCard(id);
};
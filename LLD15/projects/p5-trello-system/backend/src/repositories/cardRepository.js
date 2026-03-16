import Card from "../models/Card.js";

export const createCard = (data) => {
  return Card.create(data);
};

export const getCardsByList = (listId) => {
  return Card.find({ listId }).sort({ position: 1 });
};

export const updateCard = (id, data) => {
  return Card.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCard = (id) => {
  return Card.findByIdAndDelete(id);
};
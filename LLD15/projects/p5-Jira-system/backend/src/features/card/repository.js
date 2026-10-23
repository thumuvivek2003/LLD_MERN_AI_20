import Card from "./model.js";

export const createCardRepo = (data) => Card.create(data);

export const updateCardRepo = (id, data) =>
  Card.findByIdAndUpdate(id, data, { new: true });

export const deleteCardRepo = (id) =>
  Card.findByIdAndDelete(id);

export const getCardsByColumnRepo = (columnId) =>
  Card.find({ columnId }).sort({ position: 1 });
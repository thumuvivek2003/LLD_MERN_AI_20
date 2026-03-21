import CardLabel from "./model.js";

export const addLabelRepo = (data) =>
  CardLabel.create(data);

export const removeLabelRepo = (cardId, labelId) =>
  CardLabel.findOneAndDelete({ cardId, labelId });

export const getLabelsByCardRepo = (cardId) =>
  CardLabel.find({ cardId }).populate("labelId");
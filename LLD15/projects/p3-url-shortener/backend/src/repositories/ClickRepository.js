import Click from "../models/ClickModel.js";

export const createClick = async (clickData) => {
  return await Click.create(clickData);
};

export const findClicksByShortCode = async (shortCode) => {
  return await Click.find({ shortCode });
};

export const countClicks = async (shortCode) => {
  return await Click.countDocuments({ shortCode });
};
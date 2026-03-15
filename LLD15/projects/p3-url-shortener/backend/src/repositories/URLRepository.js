import URL from "../models/URLModel.js";

export const createURL = async (data) => {
  return await URL.create(data);
};

export const findByShortCode = async (shortCode) => {
  return await URL.findOne({ shortCode });
};

export const incrementClicks = async (shortCode) => {
  return await URL.updateOne(
    { shortCode },
    { $inc: { clickCount: 1 } }
  );
};
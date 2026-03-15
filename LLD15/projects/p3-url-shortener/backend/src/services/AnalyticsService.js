import { incrementClicks } from "../repositories/URLRepository.js";

export const recordClick = async (shortCode) => {
  await incrementClicks(shortCode);
};
import {
  createClick,
  countClicks
} from "../repositories/ClickRepository.js";

export const recordClick = async (data) => {

  return await createClick({
    shortCode: data.shortCode,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    device: data.device
  });

};

export const getClickCount = async (shortCode) => {
  return await countClicks(shortCode);
};
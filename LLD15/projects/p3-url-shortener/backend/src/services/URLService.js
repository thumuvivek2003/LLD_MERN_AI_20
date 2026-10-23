import { generateShortCode } from "../utils/ShortCodeGenerator.js";
import { isValidURL } from "../utils/URLValidator.js";
import {
  createURL,
  findByShortCode
} from "../repositories/URLRepository.js";
import redisClient from "../config/redisClient.js";
import { analyticsQueue } from "../queues/analyticsQueue.js";

export const createShortURL = async (longUrl, expiresAt = null) => {
  if (!isValidURL(longUrl)) {
    throw new Error("Invalid URL");
  }

  let shortCode;
  let existing;

  do {
    shortCode = generateShortCode();
    existing = await findByShortCode(shortCode);
  } while (existing);

  const url = await createURL({
    shortCode,
    longUrl,
    expiresAt
  });

  return url;
};


export const getOriginalURL = async (shortCode) => {
  const cached = await redisClient.get(shortCode);
  if (cached) {
    return { longUrl: cached };
  }
  const url = await findByShortCode(shortCode);
  if (!url) throw new Error("URL not found");
  if (url.expiresAt && new Date() > url.expiresAt) {
    throw new Error("Link expired");
  }
  await redisClient.set(shortCode, url.longUrl);
  return url;
};

export const handleRedirect = async ({ shortCode, ip, userAgent }) => {
  const url = await getOriginalURL(shortCode);
  // await analyticsQueue.add("trackClick", {
  //   shortCode,
  //   ip,
  //   userAgent
  // });
  return url.longUrl;
};
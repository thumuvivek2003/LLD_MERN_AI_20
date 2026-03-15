import { generateShortCode } from "../utils/ShortCodeGenerator.js";
import { isValidURL } from "../utils/URLValidator.js";
import {
  createURL,
  findByShortCode
} from "../repositories/URLRepository.js";

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
  const url = await findByShortCode(shortCode);

  if (!url) {
    throw new Error("Short URL not found");
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    throw new Error("Link expired");
  }

  return url;
};
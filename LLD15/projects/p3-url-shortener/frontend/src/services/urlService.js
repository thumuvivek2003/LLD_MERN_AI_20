import { createShortURL } from "../api/urlApi";

export const shortenURL = async (longUrl) => {

  const response = await createShortURL({
    longUrl
  });

  return response.data;
};
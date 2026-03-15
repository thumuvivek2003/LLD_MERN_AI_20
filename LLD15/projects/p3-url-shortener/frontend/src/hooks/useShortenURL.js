import { useState } from "react";
import { shortenURL } from "../services/urlService";

export const useShortenURL = () => {

  const [shortURL, setShortURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateShortURL = async (longUrl) => {

    try {
      setLoading(true);
      setError(null);

      const data = await shortenURL(longUrl);

      setShortURL(data.shortUrl);

    } catch (err) {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return {
    shortURL,
    loading,
    error,
    generateShortURL
  };
};
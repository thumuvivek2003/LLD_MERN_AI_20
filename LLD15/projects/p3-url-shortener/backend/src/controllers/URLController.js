import { createShortURL,getOriginalURL } from "../services/URLService.js";
import { recordClick } from "../services/AnalyticsService.js";

export const createShortUrl = async (req, res) => {
  try {
    const { longUrl, expiresAt } = req.body;

    const url = await createShortURL(longUrl, expiresAt);

    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
      shortCode: url.shortCode
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await getOriginalURL(shortCode);

    await recordClick(shortCode);

    return res.redirect(url.longUrl);

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
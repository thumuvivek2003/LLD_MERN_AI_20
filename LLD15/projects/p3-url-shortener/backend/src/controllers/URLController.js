import { createShortURL, handleRedirect } from "../services/URLService.js";
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
    const longUrl = await handleRedirect({
      shortCode: req.params.shortCode,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });
    return res.redirect(longUrl);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
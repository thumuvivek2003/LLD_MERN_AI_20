export const validateShortenRequest = (req, res, next) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({
      error: "longUrl is required"
    });
  }

  next();
};
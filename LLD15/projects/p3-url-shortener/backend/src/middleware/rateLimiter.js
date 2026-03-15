import rateLimit from "express-rate-limit";

export const shortenLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 Requests for minute
  max: 5,
  message: "Too many requests, try again later"
});
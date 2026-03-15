import express from "express";
import { createShortUrl,redirectUrl } from "../controllers/URLController.js";

import { validateShortenRequest } from "../middleware/validateRequest.js";
import { shortenLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/shorten", shortenLimiter,validateShortenRequest, createShortUrl);

router.get("/:shortCode", redirectUrl);

export default router;
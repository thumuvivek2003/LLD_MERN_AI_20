import express from "express";
import { createShortUrl,redirectUrl } from "../controllers/URLController.js";

import { validateShortenRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/shorten", validateShortenRequest, createShortUrl);

router.get("/:shortCode", redirectUrl);

export default router;
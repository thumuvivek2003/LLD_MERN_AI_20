import express from "express";
import {
  addLabel,
  removeLabel,
  getLabels,
} from "./controller.js";

const router = express.Router();

router.post("/", addLabel);
router.delete("/", removeLabel);
router.get("/:cardId", getLabels);

export default router;
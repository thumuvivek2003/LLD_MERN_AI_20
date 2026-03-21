import express from "express";
import {
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} from "./controller.js";

const router = express.Router();

router.post("/", createCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);
router.put("/move", moveCard);

export default router;
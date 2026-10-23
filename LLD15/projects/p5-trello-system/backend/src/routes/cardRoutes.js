import express from "express";
import * as cardController from "../controllers/cardController.js";

const router = express.Router();

router.post("/:listId", cardController.createCard);
router.get("/:listId", cardController.getCards);
router.put("/update/:id", cardController.updateCard);
router.delete("/delete/:id", cardController.deleteCard);

export default router;

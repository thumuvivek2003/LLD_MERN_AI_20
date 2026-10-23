import express from "express";
import * as boardController from "../controllers/boardController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/:id", auth, boardController.getBoardById);
router.get("/all/:id", auth, boardController.getBoardListCards)
router.post("/", auth, boardController.createBoard);
router.get("/", auth, boardController.getBoards);
router.delete("/:id", auth, boardController.deleteBoard);

export default router;
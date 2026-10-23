import express from "express";
import * as listController from "../controllers/listController.js";

const router = express.Router();

router.post("/:boardId", listController.createList);
router.get("/:boardId", listController.getLists);
router.put("/update/:id", listController.updateList);
router.delete("/delete/:id", listController.deleteList);

export default router;

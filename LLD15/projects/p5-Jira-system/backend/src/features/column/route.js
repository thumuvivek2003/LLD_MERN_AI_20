import express from "express";
import {
  addColumn,
  updateColumn,
  deleteColumn,
  getColumns,
} from "./controller.js";

const router = express.Router();

router.post("/", addColumn);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);
router.get("/:boardId", getColumns);

export default router;
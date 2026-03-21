import express from "express";
import { createLabel, getLabels } from "./controller.js";

const router = express.Router();

router.post("/", createLabel);
router.get("/:boardId", getLabels);

export default router;
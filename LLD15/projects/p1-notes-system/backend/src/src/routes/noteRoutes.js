import express from "express";
import noteController from "../controllers/noteController.js";
import validateNote from "../validators/noteValidator.js";

const router = express.Router();

router.post("/", validateNote, noteController.createNote);
router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNote);
router.put("/:id", validateNote, noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

export default router;
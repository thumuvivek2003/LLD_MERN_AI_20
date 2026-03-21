import express from "express";
import {
  addMember,
  updateRole,
  removeMember,
  getMembers,
} from "./controller.js";

const router = express.Router();

router.post("/", addMember);
router.put("/", updateRole);
router.delete("/", removeMember);
router.get("/:boardId", getMembers);

export default router;
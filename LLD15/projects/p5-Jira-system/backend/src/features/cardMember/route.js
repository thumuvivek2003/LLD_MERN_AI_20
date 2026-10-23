import express from "express";
import {
  assignMember,
  unassignMember,
  getAssignedMembers,
} from "./controller.js";

const router = express.Router();

router.post("/", assignMember);
router.delete("/", unassignMember);
router.get("/:cardId", getAssignedMembers);

export default router;
import express from "express";
import {
  addPermissionToRole,
  removePermissionFromRole,
  getPermissionsByRole,
} from "./controller.js";

const router = express.Router();

router.post("/", addPermissionToRole);
router.delete("/", removePermissionFromRole);
router.get("/:roleId", getPermissionsByRole);

export default router;
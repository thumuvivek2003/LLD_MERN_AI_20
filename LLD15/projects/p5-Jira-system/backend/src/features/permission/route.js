import express from "express";
import {
  createPermission,
  getPermissions,
} from "./controller.js";

const router = express.Router();

router.post("/", createPermission);
router.get("/", getPermissions);

export default router;
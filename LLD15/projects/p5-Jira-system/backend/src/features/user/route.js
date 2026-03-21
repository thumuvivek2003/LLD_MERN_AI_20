import express from "express";
import { createUser, login, resetPassword } from "./controller.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.put("/reset-password", resetPassword);

export default router;
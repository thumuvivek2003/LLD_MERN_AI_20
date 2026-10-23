import express from "express";
import AuthController from "../controllers/AuthController.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();


router.post("/signup", (req, res) =>
  AuthController.signup(req, res)
);

router.post("/login", loginLimiter, (req, res) =>
  AuthController.login(req, res)
);

export default router;
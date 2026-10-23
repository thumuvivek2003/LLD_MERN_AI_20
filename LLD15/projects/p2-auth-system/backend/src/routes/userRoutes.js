import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import UserController from "../controllers/UserController.js";
import tokenBlacklistMiddleware from "../middleware/tokenBlacklistMiddleware.js";
const router = express.Router();

router.use(authMiddleware);
router.use(tokenBlacklistMiddleware);
router.get("/profile", UserController.getProfile);


router.use(roleMiddleware("admin"));
router.get("/", UserController.getAllUsers);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post("/", UserController.createUser);

export default router;
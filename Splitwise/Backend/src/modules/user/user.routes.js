import { Router } from "express";
import * as userController from "./user.controller.js";

export function registerUserRoutes() {
  const router = Router();

  router.post("/", userController.registerUser);
  router.get("/", userController.listUsers);
  router.get("/:userId", userController.getProfile);

  return router;
}

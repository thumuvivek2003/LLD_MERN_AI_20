import { Router } from "express";
import * as groupController from "./group.controller.js";

export function registerGroupRoutes() {
  const router = Router();

  router.post("/", groupController.createGroup);
  router.get("/", groupController.listGroups);
  router.get("/:groupId", groupController.getGroup);
  router.patch("/:groupId", groupController.editGroup);

  router.post("/:groupId/members", groupController.addMember);
  router.delete("/:groupId/members/:userId", groupController.removeMember);
  router.post("/:groupId/leave", groupController.leaveGroup);

  return router;
}

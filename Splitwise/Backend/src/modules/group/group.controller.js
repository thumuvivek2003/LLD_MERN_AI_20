import * as groupService from "./group.service.js";
import { successResponse } from "../../core/utils/response.util.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";

export const createGroup = asyncHandler(async (req, res) => {
  const group = await groupService.createGroup(req.body || {});
  successResponse(res, { group }, 201);
});

export const listGroups = asyncHandler(async (req, res) => {
  const userId = req.query.userId || undefined;
  const groups = await groupService.listGroups({ userId });
  successResponse(res, { groups });
});

export const getGroup = asyncHandler(async (req, res) => {
  const group = await groupService.getGroup(req.params.groupId);
  successResponse(res, { group });
});

export const editGroup = asyncHandler(async (req, res) => {
  const group = await groupService.editGroup(req.params.groupId, req.body || {});
  successResponse(res, { group });
});

export const addMember = asyncHandler(async (req, res) => {
  const group = await groupService.addMember(req.params.groupId, req.body || {});
  successResponse(res, { group });
});

export const removeMember = asyncHandler(async (req, res) => {
  const group = await groupService.removeMember(req.params.groupId, req.params.userId);
  successResponse(res, { group });
});

export const leaveGroup = asyncHandler(async (req, res) => {
  const group = await groupService.leaveGroup(req.params.groupId, req.body || {});
  successResponse(res, { group });
});

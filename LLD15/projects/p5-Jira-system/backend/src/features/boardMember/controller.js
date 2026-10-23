import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  addMemberService,
  updateRoleService,
  removeMemberService,
  getMembersService,
} from "./service.js";

export const addMember = asyncHandler(async (req, res) => {
  const data = await addMemberService(req.body);
  successResponse(res, data);
});

export const updateRole = asyncHandler(async (req, res) => {
  const data = await updateRoleService(
    req.body.boardId,
    req.body.userId,
    req.body.roleId
  );
  successResponse(res, data);
});

export const removeMember = asyncHandler(async (req, res) => {
  await removeMemberService(req.body.boardId, req.body.userId);
  successResponse(res, null, "Removed");
});

export const getMembers = asyncHandler(async (req, res) => {
  const data = await getMembersService(req.params.boardId);
  successResponse(res, data);
});
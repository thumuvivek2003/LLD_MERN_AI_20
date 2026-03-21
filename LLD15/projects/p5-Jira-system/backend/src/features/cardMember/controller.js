import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  assignMemberService,
  unassignMemberService,
  getAssignedMembersService,
} from "./service.js";

export const assignMember = asyncHandler(async (req, res) => {
  const data = await assignMemberService(req.body);
  successResponse(res, data);
});

export const unassignMember = asyncHandler(async (req, res) => {
  await unassignMemberService(req.body.cardId, req.body.userId);
  successResponse(res, null, "Unassigned");
});

export const getAssignedMembers = asyncHandler(async (req, res) => {
  const data = await getAssignedMembersService(req.params.cardId);
  successResponse(res, data);
});
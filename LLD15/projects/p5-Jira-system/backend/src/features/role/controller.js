import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { createRoleService, getRolesService } from "./service.js";

export const createRole = asyncHandler(async (req, res) => {
  const role = await createRoleService(req.body);
  successResponse(res, role);
});

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await getRolesService();
  successResponse(res, roles);
});
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  addPermissionToRoleService,
  removePermissionFromRoleService,
  getPermissionsByRoleService,
} from "./service.js";

export const addPermissionToRole = asyncHandler(async (req, res) => {
  const data = await addPermissionToRoleService(req.body);
  successResponse(res, data);
});

export const removePermissionFromRole = asyncHandler(async (req, res) => {
  await removePermissionFromRoleService(
    req.body.roleId,
    req.body.permissionId
  );
  successResponse(res, null, "Removed");
});

export const getPermissionsByRole = asyncHandler(async (req, res) => {
  const data = await getPermissionsByRoleService(req.params.roleId);
  successResponse(res, data);
});
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createPermissionService,
  getPermissionsService,
} from "./service.js";

export const createPermission = asyncHandler(async (req, res) => {
  const data = await createPermissionService(req.body);
  successResponse(res, data);
});

export const getPermissions = asyncHandler(async (req, res) => {
  const data = await getPermissionsService();
  successResponse(res, data);
});
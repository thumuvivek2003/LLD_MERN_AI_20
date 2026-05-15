import * as userService from "./user.service.js";
import { successResponse } from "../../core/utils/response.util.js";
import { asyncHandler } from "../../core/utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body || {});
  successResponse(res, { user }, 201);
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  successResponse(res, { users });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.params.userId);
  successResponse(res, { user });
});

import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createUserService,
  loginService,
  resetPasswordService,
} from "./service.js";

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  successResponse(res, user, "User created");
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginService(req.body);
  successResponse(res, data, "Login success");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await resetPasswordService(
    req.body.userId,
    req.body.newPassword
  );
  successResponse(res, user, "Password updated");
});
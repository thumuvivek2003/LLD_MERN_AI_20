import * as authService from './auth.service.js';
import { toUserResponse } from '../user/user.mapper.js';
import { successResponse } from '../../shared/utils/response.util.js';
import { markOffline } from '../presence/presence.service.js';

export async function loginWithMobile(req, res, next) {
  try {
    const { mobile } = req.body;
    const otp = authService.generateOtp(mobile);
    return successResponse(res, { mobile, otp });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { mobile, otp, name } = req.body;
    const { token, user } = await authService.verifyAndIssueToken({ mobile, otp, name });
    return successResponse(res, { token, user: toUserResponse(user) });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Best-effort: mark user offline. Real socket disconnection still owns presence.
    if (req.user?.id) {
      await markOffline(req.user.id).catch(() => {});
    }
    return successResponse(res, { loggedOut: true });
  } catch (err) {
    next(err);
  }
}

import { ADMIN_SEED } from '../../shared/constants/app.constant.js';
import { ROLES } from '../../shared/constants/roles.constant.js';
import { generateOtp as otpGenerate } from '../../shared/utils/otp.util.js';
import { generateAccessToken } from '../../shared/utils/jwt.util.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';
import { env } from '../../config/env.config.js';
import * as authRepo from './auth.repository.js';

/**
 * MVP OTP — always returns dev-fixed OTP. In real life we would
 * persist this with a TTL.
 */
export function generateOtp(_mobile) {
  return otpGenerate();
}

/**
 * Accepts any value that matches the dev fixed OTP. Frontend can
 * also display the OTP returned from /auth/login for convenience.
 */
export function validateOtp(_mobile, otp) {
  return String(otp) === String(env.devFixedOtp);
}

export function generateTokens(user) {
  const token = generateAccessToken({
    sub: String(user._id || user.id),
    role: user.role,
    mobile: user.mobile,
  });
  return { token };
}

/**
 * Find or create a user on OTP verify. Admin mobile auto-elevates.
 */
export async function findOrCreateUser({ mobile, name }) {
  let user = await authRepo.findUserByMobile(mobile);
  if (user) return user;

  const isAdminMobile = mobile === ADMIN_SEED.mobile;
  const finalName =
    (name && name.trim()) ||
    (isAdminMobile ? ADMIN_SEED.name : `User-${mobile.slice(-4)}`);
  const role = isAdminMobile ? ROLES.ADMIN : ROLES.USER;

  user = await authRepo.createUser({ name: finalName, mobile, role });
  return user;
}

export async function verifyAndIssueToken({ mobile, otp, name }) {
  if (!validateOtp(mobile, otp)) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid OTP');
  }
  const user = await findOrCreateUser({ mobile, name });
  const { token } = generateTokens(user);
  return { token, user };
}

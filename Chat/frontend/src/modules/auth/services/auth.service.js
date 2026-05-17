import { api, unwrap } from '../../../api/axios.js';

/**
 * POST /api/auth/login — request OTP for a mobile number.
 */
export function loginWithMobile(mobile) {
  return unwrap(api.post('/auth/login', { mobile }));
}

/**
 * POST /api/auth/verify-otp — exchange OTP for JWT + user.
 */
export function verifyOtp({ mobile, otp, name }) {
  return unwrap(api.post('/auth/verify-otp', { mobile, otp, name }));
}

/**
 * POST /api/auth/logout — invalidate server-side session.
 */
export function logout() {
  return unwrap(api.post('/auth/logout'));
}

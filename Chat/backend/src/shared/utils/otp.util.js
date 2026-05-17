import { env } from '../../config/env.config.js';

/**
 * MVP: always return the dev fixed OTP so login is deterministic.
 * Swap with real generator when integrating an SMS provider.
 */
export function generateOtp() {
  return env.devFixedOtp || '123456';
}

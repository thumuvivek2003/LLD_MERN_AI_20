import { otpRepository } from './otp.repository.js';
import { generateOtp } from '../../core/utils/otp.util.js';

class OtpService {
  generateForRide(rideId, length = 4) {
    const otp = generateOtp(length);
    otpRepository.set(rideId, otp);
    return otp;
  }

  verify(rideId, otp) {
    const expected = otpRepository.get(rideId);
    return expected && String(expected) === String(otp);
  }

  clear(rideId) {
    otpRepository.delete(rideId);
  }
}

export const otpService = new OtpService();

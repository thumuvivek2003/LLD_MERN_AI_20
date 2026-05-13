import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';
import { RideError } from '../../../core/exceptions/ride.error.js';

export class ArrivingState extends RideState {
  constructor() { super(RIDE_STATUS.DRIVER_ARRIVING); }

  verifyOtp(ride, otp) {
    if (!ride.otp || String(ride.otp) !== String(otp)) {
      throw new RideError('Invalid OTP', 400);
    }
    ride.status = RIDE_STATUS.OTP_VERIFIED;
  }

  cancel(ride, by) {
    ride.status = RIDE_STATUS.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancelledBy = by;
  }
}

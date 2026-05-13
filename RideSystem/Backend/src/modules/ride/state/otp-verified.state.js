import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';

export class OtpVerifiedState extends RideState {
  constructor() { super(RIDE_STATUS.OTP_VERIFIED); }

  start(ride) {
    ride.status = RIDE_STATUS.IN_PROGRESS;
    ride.startedAt = new Date();
  }
}

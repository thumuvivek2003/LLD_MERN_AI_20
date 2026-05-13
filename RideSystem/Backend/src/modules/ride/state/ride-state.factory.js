import { RIDE_STATUS } from '../../../config/constants.js';
import { RequestedState } from './requested.state.js';
import { AssignedState } from './assigned.state.js';
import { ArrivingState } from './arriving.state.js';
import { OtpVerifiedState } from './otp-verified.state.js';
import { InProgressState } from './in-progress.state.js';
import { CompletedState } from './completed.state.js';
import { CancelledState } from './cancelled.state.js';
import { AppError } from '../../../core/exceptions/app.error.js';

const REGISTRY = {
  [RIDE_STATUS.REQUESTED]: new RequestedState(),
  [RIDE_STATUS.DRIVER_ASSIGNED]: new AssignedState(),
  [RIDE_STATUS.DRIVER_ARRIVING]: new ArrivingState(),
  [RIDE_STATUS.OTP_VERIFIED]: new OtpVerifiedState(),
  [RIDE_STATUS.IN_PROGRESS]: new InProgressState(),
  [RIDE_STATUS.COMPLETED]: new CompletedState(),
  [RIDE_STATUS.CANCELLED]: new CancelledState(),
};

export const RideStateFactory = {
  forRide(ride) {
    const state = REGISTRY[ride.status];
    if (!state) throw new AppError(`Unknown ride status: ${ride.status}`, 500);
    return state;
  },
};

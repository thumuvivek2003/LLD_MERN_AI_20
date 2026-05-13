import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';

export class InProgressState extends RideState {
  constructor() { super(RIDE_STATUS.IN_PROGRESS); }

  complete(ride) {
    ride.status = RIDE_STATUS.COMPLETED;
    ride.completedAt = new Date();
  }
}

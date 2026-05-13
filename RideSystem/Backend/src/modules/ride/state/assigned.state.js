import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';

export class AssignedState extends RideState {
  constructor() { super(RIDE_STATUS.DRIVER_ASSIGNED); }

  arrive(ride) {
    ride.status = RIDE_STATUS.DRIVER_ARRIVING;
    ride.arrivedAt = new Date();
  }

  cancel(ride, by) {
    ride.status = RIDE_STATUS.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancelledBy = by;
  }
}

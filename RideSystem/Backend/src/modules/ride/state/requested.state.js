import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';

export class RequestedState extends RideState {
  constructor() { super(RIDE_STATUS.REQUESTED); }

  assign(ride, { driverId, vehicleId }) {
    ride.driver = driverId;
    ride.vehicle = vehicleId;
    ride.status = RIDE_STATUS.DRIVER_ASSIGNED;
    ride.assignedAt = new Date();
  }

  cancel(ride, by) {
    ride.status = RIDE_STATUS.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancelledBy = by;
  }
}

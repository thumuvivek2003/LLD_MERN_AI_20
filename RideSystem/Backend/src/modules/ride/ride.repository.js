import { BaseRepository } from '../../core/base/base.repository.js';
import { Ride } from './ride.model.js';
import { RIDE_STATUS } from '../../config/constants.js';

class RideRepository extends BaseRepository {
  constructor() {
    super(Ride);
  }

  findByRider(riderId) {
    return this.model
      .find({ rider: riderId })
      .sort({ createdAt: -1 })
      .populate('driver')
      .populate('vehicle');
  }

  findByDriver(driverId) {
    return this.model
      .find({ driver: driverId })
      .sort({ createdAt: -1 })
      .populate('rider')
      .populate('vehicle');
  }

  findActiveByDriver(driverId) {
    return this.model.findOne({
      driver: driverId,
      status: { $in: [RIDE_STATUS.DRIVER_ASSIGNED, RIDE_STATUS.DRIVER_ARRIVING, RIDE_STATUS.OTP_VERIFIED, RIDE_STATUS.IN_PROGRESS] },
    });
  }

  findActiveByRider(riderId) {
    return this.model
      .findOne({
        rider: riderId,
        status: { $in: [RIDE_STATUS.REQUESTED, RIDE_STATUS.DRIVER_ASSIGNED, RIDE_STATUS.DRIVER_ARRIVING, RIDE_STATUS.OTP_VERIFIED, RIDE_STATUS.IN_PROGRESS] },
      })
      .populate('driver')
      .populate('vehicle');
  }

  findPending() {
    return this.model.find({ status: RIDE_STATUS.REQUESTED }).sort({ createdAt: 1 });
  }

  // Atomic assignment to prevent race conditions when multiple drivers accept
  atomicAssignDriver(rideId, driverId, vehicleId) {
    return this.model.findOneAndUpdate(
      { _id: rideId, status: RIDE_STATUS.REQUESTED, driver: null },
      {
        $set: {
          driver: driverId,
          vehicle: vehicleId,
          status: RIDE_STATUS.DRIVER_ASSIGNED,
          assignedAt: new Date(),
        },
      },
      { new: true },
    );
  }
}

export const rideRepository = new RideRepository();

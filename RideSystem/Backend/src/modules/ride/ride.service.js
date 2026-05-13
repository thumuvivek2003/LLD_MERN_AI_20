import { BaseService } from '../../core/base/base.service.js';
import { rideRepository } from './ride.repository.js';
import { driverService } from '../driver/driver.service.js';
import { otpService } from '../otp/otp.service.js';
import { RideStateFactory } from './state/ride-state.factory.js';
import { DriverStrategyFactory } from './strategies/driver-strategy.factory.js';
import { haversineKm } from '../../core/utils/distance.util.js';
import { calculateFare } from '../../core/utils/fare.util.js';
import { AppError } from '../../core/exceptions/app.error.js';
import { RideError } from '../../core/exceptions/ride.error.js';
import { RidePublisher } from '../../core/event-bus/publishers/ride.publisher.js';
import { rideCreatedPayload } from './events/ride-created.event.js';
import { rideAcceptedPayload } from './events/ride-accepted.event.js';
import { rideStartedPayload } from './events/ride-started.event.js';
import { rideCompletedPayload } from './events/ride-completed.event.js';
import { RIDE_STATUS, DRIVER_STATUS } from '../../config/constants.js';

class RideService extends BaseService {
  constructor() {
    super(rideRepository);
  }

  async create(riderId, { pickup, drop, strategy = 'NEAREST' }) {
    const active = await this.repository.findActiveByRider(riderId);
    if (active) throw new RideError('You already have an active ride', 409);

    const unpaid = await this.repository.findUnpaidByRider(riderId);
    if (unpaid) {
      throw new RideError(
        `Please pay ₹${unpaid.fare} for your previous ride before booking again`,
        402,
      );
    }

    const distanceKm = Number(haversineKm(pickup, drop).toFixed(2));
    const fare = calculateFare(distanceKm);

    const ride = await this.repository.create({
      rider: riderId,
      pickup,
      drop,
      distanceKm,
      fare,
      status: RIDE_STATUS.REQUESTED,
    });

    // Strategy: pick driver candidates and publish for them
    const onlineDrivers = await driverService.listOnline();
    const ranked = DriverStrategyFactory.get(strategy).match(onlineDrivers, ride);
    const candidateIds = ranked.slice(0, 10).map((d) => String(d.user?._id || d.user));

    RidePublisher.rideCreated(rideCreatedPayload(ride, candidateIds));
    return ride;
  }

  async accept(rideId, driverUserId) {
    const driverProfile = await driverService.getByUser(driverUserId);
    if (!driverProfile.activeVehicle) {
      throw new RideError('Register a vehicle before accepting rides', 400);
    }
    if (driverProfile.status === DRIVER_STATUS.OFFLINE) {
      throw new RideError('Go online before accepting rides', 403);
    }
    const activeForDriver = await this.repository.findActiveByDriver(driverUserId);
    if (activeForDriver) {
      throw new RideError('Finish your current ride before accepting another', 409);
    }
    const updated = await this.repository.atomicAssignDriver(
      rideId,
      driverUserId,
      driverProfile.activeVehicle,
    );
    if (!updated) throw new RideError('Ride already taken or unavailable', 409);

    // Generate OTP for rider to share
    const otp = otpService.generateForRide(rideId);
    updated.otp = otp;
    await updated.save();

    await driverService.setBusy(driverUserId, true);

    RidePublisher.rideAccepted(rideAcceptedPayload(updated));
    return updated;
  }

  async markArriving(rideId, driverUserId) {
    const ride = await this.#getOwnedByDriver(rideId, driverUserId);
    const state = RideStateFactory.forRide(ride);
    state.arrive(ride);
    await ride.save();
    RidePublisher.rideArriving({ rideId: String(ride._id), riderId: String(ride.rider) });
    return ride;
  }

  async verifyOtp(rideId, driverUserId, otp) {
    const ride = await this.#getOwnedByDriver(rideId, driverUserId);
    // Allow OTP verify from assigned OR arriving state
    if (ride.status === RIDE_STATUS.DRIVER_ASSIGNED) {
      ride.status = RIDE_STATUS.DRIVER_ARRIVING;
      ride.arrivedAt = new Date();
    }
    const state = RideStateFactory.forRide(ride);
    state.verifyOtp(ride, otp);
    // After OTP verified, transition to in_progress immediately for MVP
    const verifiedState = RideStateFactory.forRide(ride);
    verifiedState.start(ride);
    await ride.save();
    RidePublisher.rideOtpVerified({ rideId: String(ride._id), riderId: String(ride.rider) });
    RidePublisher.rideStarted(rideStartedPayload(ride));
    return ride;
  }

  async complete(rideId, driverUserId) {
    const ride = await this.#getOwnedByDriver(rideId, driverUserId);
    const state = RideStateFactory.forRide(ride);
    state.complete(ride);
    await ride.save();
    await driverService.setStatus(driverUserId, DRIVER_STATUS.ONLINE);
    RidePublisher.rideCompleted(rideCompletedPayload(ride));
    return ride;
  }

  async cancel(rideId, userId, role) {
    const ride = await this.repository.findById(rideId);
    if (!ride) throw new AppError('Ride not found', 404);
    if (role === 'RIDER' && String(ride.rider) !== String(userId)) {
      throw new RideError('Not your ride', 403);
    }
    if (role === 'DRIVER' && String(ride.driver) !== String(userId)) {
      throw new RideError('Not your ride', 403);
    }
    const state = RideStateFactory.forRide(ride);
    state.cancel(ride, role);
    await ride.save();
    if (ride.driver) await driverService.setStatus(ride.driver, DRIVER_STATUS.ONLINE);
    RidePublisher.rideCancelled({
      rideId: String(ride._id),
      riderId: String(ride.rider),
      driverId: ride.driver ? String(ride.driver) : null,
      by: role,
    });
    return ride;
  }

  async getById(rideId) {
    const ride = await this.repository.model
      .findById(rideId)
      .populate('rider')
      .populate('driver')
      .populate('vehicle');
    if (!ride) throw new AppError('Ride not found', 404);
    return ride;
  }

  listByRider(riderId) {
    return this.repository.findByRider(riderId);
  }

  listByDriver(driverId) {
    return this.repository.findByDriver(driverId);
  }

  getActiveByRider(riderId) {
    return this.repository.findActiveByRider(riderId);
  }

  getUnpaidByRider(riderId) {
    return this.repository.findUnpaidByRider(riderId);
  }

  getActiveByDriver(driverId) {
    return this.repository.findActiveByDriver(driverId);
  }

  listPending() {
    return this.repository.findPending();
  }

  async #getOwnedByDriver(rideId, driverUserId) {
    const ride = await this.repository.findById(rideId);
    if (!ride) throw new AppError('Ride not found', 404);
    if (!ride.driver || String(ride.driver) !== String(driverUserId)) {
      throw new RideError('Not your ride', 403);
    }
    return ride;
  }
}

export const rideService = new RideService();

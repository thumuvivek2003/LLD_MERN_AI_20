export const RIDE_STARTED = 'ride.started';
export const rideStartedPayload = (ride) => ({
  rideId: String(ride._id),
  riderId: String(ride.rider),
  driverId: String(ride.driver),
  startedAt: ride.startedAt,
});

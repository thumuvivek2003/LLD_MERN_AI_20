export const RIDE_ACCEPTED = 'ride.accepted';
export const rideAcceptedPayload = (ride) => ({
  rideId: String(ride._id),
  riderId: String(ride.rider),
  driverId: String(ride.driver),
  vehicleId: ride.vehicle ? String(ride.vehicle) : null,
});

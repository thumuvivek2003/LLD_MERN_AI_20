export const RIDE_COMPLETED = 'ride.completed';
export const rideCompletedPayload = (ride) => ({
  rideId: String(ride._id),
  riderId: String(ride.rider),
  driverId: String(ride.driver),
  fare: ride.fare,
  completedAt: ride.completedAt,
});

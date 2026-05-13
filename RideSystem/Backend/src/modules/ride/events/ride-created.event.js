export const RIDE_CREATED = 'ride.created';
export const rideCreatedPayload = (ride, candidates = []) => ({
  rideId: String(ride._id),
  riderId: String(ride.rider),
  pickup: ride.pickup,
  drop: ride.drop,
  fare: ride.fare,
  distanceKm: ride.distanceKm,
  candidates,
});

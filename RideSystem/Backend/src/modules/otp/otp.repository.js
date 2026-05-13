// In-memory OTP store for MVP. Trip OTP is also persisted on the Ride document.
const store = new Map();

export const otpRepository = {
  set: (rideId, otp) => store.set(String(rideId), otp),
  get: (rideId) => store.get(String(rideId)) || null,
  delete: (rideId) => store.delete(String(rideId)),
};

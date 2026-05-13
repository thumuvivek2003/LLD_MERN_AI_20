import { eventBus } from '../eventBus.js';

export const RidePublisher = {
  rideCreated: (payload) => eventBus.emit('ride.created', payload),
  rideAccepted: (payload) => eventBus.emit('ride.accepted', payload),
  rideArriving: (payload) => eventBus.emit('ride.arriving', payload),
  rideOtpVerified: (payload) => eventBus.emit('ride.otp.verified', payload),
  rideStarted: (payload) => eventBus.emit('ride.started', payload),
  rideCompleted: (payload) => eventBus.emit('ride.completed', payload),
  rideCancelled: (payload) => eventBus.emit('ride.cancelled', payload),
};

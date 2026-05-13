export const SOCKET_EVENTS = Object.freeze({
  // connection-room
  JOIN: 'join',

  // driver -> server
  DRIVER_LOCATION_UPDATE: 'driver:location:update',
  DRIVER_GO_ONLINE: 'driver:online',
  DRIVER_GO_OFFLINE: 'driver:offline',

  // server -> rider
  RIDE_DRIVER_ASSIGNED: 'ride:driver:assigned',
  RIDE_DRIVER_ARRIVING: 'ride:driver:arriving',
  RIDE_OTP_VERIFIED: 'ride:otp:verified',
  RIDE_STARTED: 'ride:started',
  RIDE_COMPLETED: 'ride:completed',
  RIDE_PAYMENT_DONE: 'ride:payment:done',
  RIDE_DRIVER_LOCATION: 'ride:driver:location',

  // server -> driver
  RIDE_INCOMING: 'ride:incoming',
  RIDE_TAKEN: 'ride:taken',
  RIDE_CANCELLED: 'ride:cancelled',
});

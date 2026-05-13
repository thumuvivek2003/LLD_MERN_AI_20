export const ROLES = Object.freeze({
  RIDER: 'RIDER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
});

export const RIDE_STATUS = Object.freeze({
  REQUESTED: 'REQUESTED',
  DRIVER_ASSIGNED: 'DRIVER_ASSIGNED',
  DRIVER_ARRIVING: 'DRIVER_ARRIVING',
  OTP_VERIFIED: 'OTP_VERIFIED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

export const DRIVER_STATUS = Object.freeze({
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  BUSY: 'BUSY',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
});

export const PAYMENT_METHOD = Object.freeze({
  CASH: 'CASH',
  UPI: 'UPI',
  CARD: 'CARD',
});

export const VEHICLE_TYPE = Object.freeze({
  BIKE: 'BIKE',
  MINI: 'MINI',
  SEDAN: 'SEDAN',
  SUV: 'SUV',
});

export const FARE = Object.freeze({
  BASE: 30,
  PER_KM: 12,
});

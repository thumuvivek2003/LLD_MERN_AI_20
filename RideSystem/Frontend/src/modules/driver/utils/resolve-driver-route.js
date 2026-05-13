import { RIDE_STATUS } from '../../../core/constants/ride.constants.js';

const ROUTES = {
  [RIDE_STATUS.REQUESTED]: () => `/driver/incoming`,
  [RIDE_STATUS.DRIVER_ASSIGNED]: (id) => `/driver/accepted/${id}`,
  [RIDE_STATUS.DRIVER_ARRIVING]: (id) => `/driver/otp/${id}`,
  [RIDE_STATUS.OTP_VERIFIED]: (id) => `/driver/ride/${id}`,
  [RIDE_STATUS.IN_PROGRESS]: (id) => `/driver/ride/${id}`,
  [RIDE_STATUS.COMPLETED]: (id) => `/driver/summary/${id}`,
  [RIDE_STATUS.CANCELLED]: (id) => `/driver/summary/${id}`,
};

// Driver has no payment screen — the summary page itself shows
// "awaiting customer payment" when paymentStatus is PENDING.
export const resolveDriverRoute = (ride) => {
  if (!ride?.id) return '/driver';
  const build = ROUTES[ride.status] || ROUTES[RIDE_STATUS.COMPLETED];
  return build(ride.id);
};

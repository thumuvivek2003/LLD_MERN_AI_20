import { RIDE_STATUS } from '../../../core/constants/ride.constants.js';
import { PAYMENT_STATUS } from '../../../core/constants/payment.constants.js';

export const resolveRiderRoute = (ride) => {
  if (!ride?.id) return '/rider';
  const { id, status, paymentStatus } = ride;

  switch (status) {
    case RIDE_STATUS.REQUESTED:
      return `/rider/searching/${id}`;
    case RIDE_STATUS.DRIVER_ASSIGNED:
      return `/rider/accepted/${id}`;
    case RIDE_STATUS.DRIVER_ARRIVING:
      return `/rider/tracking/${id}`;
    case RIDE_STATUS.OTP_VERIFIED:
      return `/rider/tracking/${id}`;
    case RIDE_STATUS.IN_PROGRESS:
      return `/rider/in-progress/${id}`;
    case RIDE_STATUS.COMPLETED:
      return paymentStatus === PAYMENT_STATUS.PAID
        ? `/rider/ride/${id}`
        : `/rider/pay/${id}`;
    case RIDE_STATUS.CANCELLED:
      return `/rider/ride/${id}`;
    default:
      return `/rider/ride/${id}`;
  }
};

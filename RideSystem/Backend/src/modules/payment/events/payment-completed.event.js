export const PAYMENT_COMPLETED = 'payment.completed';
export const paymentCompletedPayload = (payment) => ({
  paymentId: String(payment._id),
  rideId: String(payment.ride),
  riderId: String(payment.rider),
  driverId: String(payment.driver),
  amount: payment.amount,
  method: payment.method,
});

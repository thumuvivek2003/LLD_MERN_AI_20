export const toDto = (booking) => ({
  id: booking._id,
  bookingRef: booking.bookingRef,
  show: booking.showId,
  seats: booking.seats,
  totalAmount: booking.totalAmount,
  status: booking.status,
  createdAt: booking.createdAt,
});

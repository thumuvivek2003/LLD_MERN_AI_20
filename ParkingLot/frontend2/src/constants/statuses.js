export const SlotStatus = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
});

export const TicketStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
});

export const PaymentStatus = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
});

export const VehicleType = Object.freeze({
  CAR: 'CAR',
  BIKE: 'BIKE',
  TRUCK: 'TRUCK',
});

export const AllocationStrategy = Object.freeze({
  NEAREST: 'NEAREST',
  FIRST_AVAILABLE: 'FIRST_AVAILABLE',
  RANDOM: 'RANDOM',
});

export const PaymentMethod = Object.freeze({
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
});

export const StatusTone = Object.freeze({
  [SlotStatus.AVAILABLE]: 'success',
  [SlotStatus.OCCUPIED]: 'danger',
  [SlotStatus.MAINTENANCE]: 'warning',
  [TicketStatus.ACTIVE]: 'info',
  [TicketStatus.CLOSED]: 'success',
  [TicketStatus.CANCELLED]: 'neutral',
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.FAILED]: 'danger',
});

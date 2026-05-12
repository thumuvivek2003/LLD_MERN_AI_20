export const ORDER_STATUS = Object.freeze({
  CREATED: 'CREATED',
  PAID: 'PAID',
  RESTAURANT_ACCEPTED: 'RESTAURANT_ACCEPTED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

export const ORDER_STATUS_LABEL = {
  CREATED: 'Created',
  PAID: 'Paid',
  RESTAURANT_ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLOR = {
  CREATED: 'bg-gray-100 text-gray-800',
  PAID: 'bg-blue-100 text-blue-800',
  RESTAURANT_ACCEPTED: 'bg-indigo-100 text-indigo-800',
  PREPARING: 'bg-amber-100 text-amber-800',
  READY_FOR_PICKUP: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

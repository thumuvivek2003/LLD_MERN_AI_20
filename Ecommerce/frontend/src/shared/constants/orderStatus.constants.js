export const ORDER_STATUS = {
  CREATED: 'CREATED',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_LIST = [
  ORDER_STATUS.CREATED,
  ORDER_STATUS.PAID,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
];

export const ORDER_STATUS_STYLES = {
  CREATED: 'bg-slate-100 text-slate-700',
  PAID: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

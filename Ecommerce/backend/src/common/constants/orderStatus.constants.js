export const ORDER_STATUS = Object.freeze({
  CREATED: 'CREATED',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

export const ORDER_ACTIONS = Object.freeze({
  CONFIRM: 'confirm',
  SHIP: 'ship',
  DELIVER: 'deliver',
  CANCEL: 'cancel',
});

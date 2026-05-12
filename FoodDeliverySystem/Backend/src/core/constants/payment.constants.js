export const PAYMENT_METHODS = Object.freeze({
  UPI: 'UPI',
  CARD: 'CARD',
  COD: 'COD',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
});

export const PAYMENT_METHOD_LIST = Object.values(PAYMENT_METHODS);

export const PAYMENT_TYPES = {
  UPI: 'upi',
  CARD: 'card',
  WALLET: 'wallet',
  COD: 'cod',
};

export const PAYMENT_OPTIONS = [
  { type: PAYMENT_TYPES.UPI, label: 'UPI', description: 'Pay via UPI ID or QR' },
  { type: PAYMENT_TYPES.CARD, label: 'Credit / Debit Card', description: 'Visa, Mastercard, Rupay' },
  { type: PAYMENT_TYPES.WALLET, label: 'Wallet', description: 'Paytm, PhonePe, Amazon Pay' },
  { type: PAYMENT_TYPES.COD, label: 'Cash on Delivery', description: 'Pay when order arrives' },
];

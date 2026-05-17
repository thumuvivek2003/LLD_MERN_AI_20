import UPIPaymentForm from '../components/UPIPaymentForm.jsx';
import CardPaymentForm from '../components/CardPaymentForm.jsx';
import WalletPaymentForm from '../components/WalletPaymentForm.jsx';
import { PAYMENT_TYPES } from '../../../shared/constants/payment.constants.js';

const registry = {
  [PAYMENT_TYPES.UPI]: UPIPaymentForm,
  [PAYMENT_TYPES.CARD]: CardPaymentForm,
  [PAYMENT_TYPES.WALLET]: WalletPaymentForm,
  [PAYMENT_TYPES.COD]: null,
};

export const PaymentComponentFactory = {
  create(type) {
    if (!(type in registry)) return null;
    return registry[type];
  },
};

export default PaymentComponentFactory;

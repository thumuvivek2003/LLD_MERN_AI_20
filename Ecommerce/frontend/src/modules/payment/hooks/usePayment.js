import { useState } from 'react';
import { PAYMENT_TYPES } from '../../../shared/constants/payment.constants.js';
import PaymentComponentFactory from '../factory/PaymentComponentFactory.js';

export function usePayment(initialType = PAYMENT_TYPES.UPI) {
  const [type, setType] = useState(initialType);
  const [details, setDetails] = useState({});

  function changeType(next) {
    setType(next);
    setDetails({});
  }

  const FormComponent = PaymentComponentFactory.create(type);

  function processPayment() {
    return { paymentType: type, paymentDetails: type === PAYMENT_TYPES.COD ? undefined : details };
  }

  return { type, details, setDetails, changeType, FormComponent, processPayment };
}

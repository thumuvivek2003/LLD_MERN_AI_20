import { useState } from 'react';
import { PAYMENT_METHOD_OPTIONS } from '../../../core/constants/payment.constants.js';
import { Button } from '../ui/Button.jsx';

export const PaymentForm = ({ onSubmit, loading }) => {
  const [method, setMethod] = useState('UPI');

  return (
    <div>
      <div className="space-y-2 mb-4">
        {PAYMENT_METHOD_OPTIONS.map((opt) => (
          <label key={opt.value} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${method === opt.value ? 'border-brand bg-brand-light' : 'border-gray-200 hover:bg-gray-50'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value={opt.value}
              checked={method === opt.value}
              onChange={() => setMethod(opt.value)}
              className="accent-brand"
            />
            <span className="text-2xl">{opt.icon}</span>
            <span className="font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      <Button onClick={() => onSubmit({ paymentMethod: method })} disabled={loading} className="w-full">
        {loading ? 'Processing…' : 'Pay & Place Order'}
      </Button>
    </div>
  );
};

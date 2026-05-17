import PaymentMethodCard from '../../payment/components/PaymentMethodCard.jsx';
import PaymentComponentFactory from '../../payment/factory/PaymentComponentFactory.js';
import { PAYMENT_OPTIONS } from '../../../shared/constants/payment.constants.js';

export default function PaymentSelector({ type, onTypeChange, details, onDetailsChange }) {
  const FormComponent = PaymentComponentFactory.create(type);

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Choose Payment Method</h3>
      <div className="space-y-2">
        {PAYMENT_OPTIONS.map((opt) => (
          <PaymentMethodCard
            key={opt.type}
            option={opt}
            selected={type === opt.type}
            onSelect={onTypeChange}
          />
        ))}
      </div>
      {FormComponent && <FormComponent value={details} onChange={onDetailsChange} />}
      {type === 'cod' && (
        <p className="mt-3 text-sm text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-3">
          You will pay in cash when your order is delivered.
        </p>
      )}
    </div>
  );
}

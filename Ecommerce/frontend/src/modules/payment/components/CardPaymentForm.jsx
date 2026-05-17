import Input from '../../../shared/components/Input.jsx';

export default function CardPaymentForm({ value = {}, onChange }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 mt-3 bg-slate-50/40">
      <p className="text-sm font-semibold text-slate-700 mb-3">Enter Card Details</p>
      <div className="space-y-3">
        <Input
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          value={value.cardNumber || ''}
          onChange={(e) => onChange({ ...value, cardNumber: e.target.value })}
        />
        <Input
          label="Name on Card"
          placeholder="As printed"
          value={value.cardHolder || ''}
          onChange={(e) => onChange({ ...value, cardHolder: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Expiry"
            placeholder="MM/YY"
            value={value.expiry || ''}
            onChange={(e) => onChange({ ...value, expiry: e.target.value })}
          />
          <Input
            label="CVV"
            placeholder="•••"
            maxLength={4}
            type="password"
            value={value.cvv || ''}
            onChange={(e) => onChange({ ...value, cvv: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

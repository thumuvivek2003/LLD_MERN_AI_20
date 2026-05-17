import Input from '../../../shared/components/Input.jsx';

export default function UPIPaymentForm({ value = {}, onChange }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 mt-3 bg-slate-50/40">
      <p className="text-sm font-semibold text-slate-700 mb-3">Enter UPI Details</p>
      <Input
        label="UPI ID"
        placeholder="yourname@upi"
        value={value.vpa || ''}
        onChange={(e) => onChange({ ...value, vpa: e.target.value })}
      />
    </div>
  );
}

import Input from '../../../shared/components/Input.jsx';

export default function AddressSection({ address, onChange }) {
  function update(key, value) {
    onChange({ ...address, [key]: value });
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Delivery Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Address Line"
            placeholder="House no, street, area"
            value={address.line1}
            onChange={(e) => update('line1', e.target.value)}
            required
          />
        </div>
        <Input
          label="City"
          placeholder="City"
          value={address.city}
          onChange={(e) => update('city', e.target.value)}
          required
        />
        <Input
          label="Pincode"
          placeholder="6-digit pincode"
          value={address.pincode}
          onChange={(e) => update('pincode', e.target.value)}
          required
        />
      </div>
    </div>
  );
}

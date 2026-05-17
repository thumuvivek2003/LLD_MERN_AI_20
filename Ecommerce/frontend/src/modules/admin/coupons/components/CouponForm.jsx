import { useState } from 'react';
import Input from '../../../../shared/components/Input.jsx';
import Button from '../../../../shared/components/Button.jsx';

const TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'flat', label: 'Flat' },
  { value: 'free_shipping', label: 'Free Shipping' },
];

const DEFAULTS = {
  code: '',
  type: 'percentage',
  value: 10,
  minCartValue: 0,
  description: '',
  active: true,
};

export default function CouponForm({ onSubmit, loading, error, mode = 'create', initial = null }) {
  const [form, setForm] = useState({
    ...DEFAULTS,
    ...(initial || {}),
  });

  const isEdit = mode === 'edit';

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const base = {
      type: form.type,
      value: Number(form.value) || 0,
      minCartValue: Number(form.minCartValue) || 0,
      description: form.description,
      active: !!form.active,
    };
    const payload = isEdit
      ? base
      : { ...base, code: (form.code || '').trim().toUpperCase() };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 max-w-xl">
      <Input
        label="Coupon Code"
        required={!isEdit}
        placeholder="SAVE10"
        value={form.code}
        onChange={(e) => update('code', e.target.value)}
        readOnly={isEdit}
        disabled={isEdit}
      />
      <div>
        <label className="label">Type</label>
        <select
          className="input"
          value={form.type}
          onChange={(e) => update('type', e.target.value)}
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Value"
          type="number"
          min={0}
          value={form.value}
          onChange={(e) => update('value', e.target.value)}
          disabled={form.type === 'free_shipping'}
        />
        <Input
          label="Min Cart Value"
          type="number"
          min={0}
          value={form.minCartValue}
          onChange={(e) => update('minCartValue', e.target.value)}
        />
      </div>
      <Input
        label="Description"
        placeholder="Short description"
        value={form.description || ''}
        onChange={(e) => update('description', e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={!!form.active}
          onChange={(e) => update('active', e.target.checked)}
        />
        Active
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading
          ? isEdit
            ? 'Saving...'
            : 'Creating...'
          : isEdit
          ? 'Save Changes'
          : 'Create Coupon'}
      </Button>
    </form>
  );
}

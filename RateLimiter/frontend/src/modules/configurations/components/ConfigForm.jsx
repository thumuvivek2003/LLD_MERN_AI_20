import { useEffect, useState } from 'react';
import { Button } from '../../shared/components/Button.jsx';

const FIELDS = [
  {
    name: 'maxRequests',
    label: 'Max Requests',
    hint: 'Used by Fixed/Sliding Window strategies',
  },
  {
    name: 'windowSeconds',
    label: 'Window (seconds)',
    hint: 'Time window for Fixed/Sliding',
  },
  {
    name: 'capacity',
    label: 'Bucket Capacity',
    hint: 'Token Bucket maximum',
  },
  {
    name: 'refillRatePerSec',
    label: 'Refill Rate / sec',
    hint: 'Tokens added per second',
  },
];

export function ConfigForm({ initial, onChange, onSubmit, saving }) {
  const [values, setValues] = useState(initial || {});

  useEffect(() => {
    setValues(initial || {});
  }, [initial]);

  const handle = (name, raw) => {
    const next = { ...values, [name]: raw === '' ? '' : Number(raw) };
    setValues(next);
    onChange?.(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label className="label">{f.label}</label>
            <input
              type="number"
              className="input"
              value={values[f.name] ?? ''}
              onChange={(e) => handle(f.name, e.target.value)}
              min="0"
            />
            <div className="text-[11px] text-slate-400 mt-1">{f.hint}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Save Configuration
        </Button>
      </div>
    </form>
  );
}

export default ConfigForm;

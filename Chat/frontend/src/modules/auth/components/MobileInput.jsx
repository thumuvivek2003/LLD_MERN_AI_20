import { Input } from '../../../shared/components/Input.jsx';

export function MobileInput({ value, onChange, error }) {
  function handleChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    onChange(v);
  }
  return (
    <div className="flex items-stretch gap-2">
      <div className="flex select-none items-center rounded border border-wa-border bg-wa-light px-3 text-sm text-wa-muted">
        +91
      </div>
      <div className="flex-1">
        <Input
          inputMode="numeric"
          placeholder="10-digit mobile"
          value={value}
          onChange={handleChange}
          error={error}
        />
      </div>
    </div>
  );
}

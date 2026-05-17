import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, className = '', ...rest },
  ref
) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-1 block text-sm text-wa-muted">{label}</span>
      ) : null}
      <input
        ref={ref}
        className={`w-full rounded border border-wa-border bg-white px-3 py-2 text-sm outline-none focus:border-wa-primary focus:ring-1 focus:ring-wa-primary ${className}`}
        {...rest}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      ) : null}
    </label>
  );
});

import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, className = '', leftIcon: Left, error, ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-600">
          {label}
        </span>
      )}
      <span className="relative flex items-center">
        {Left && (
          <span className="pointer-events-none absolute left-3 text-slate-400">
            <Left size={18} />
          </span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 ${
            Left ? 'pl-10' : ''
          } ${error ? 'border-red-300' : 'border-slate-200'} ${className}`}
          {...props}
        />
      </span>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, className = '', rows = 8, ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-600">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 ${className}`}
        {...props}
      />
    </label>
  );
});

export default Input;

import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, hint, className = '', id, leftIcon, rightIcon, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={[
            'block w-full rounded-lg border bg-white text-ink-800 placeholder:text-ink-400',
            'h-11 px-3.5 text-sm transition',
            'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400',
            error ? 'border-red-300' : 'border-ink-200',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className,
          ].join(' ')}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
            {rightIcon}
          </span>
        )}
      </div>
      {(error || hint) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-red-600' : 'text-ink-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

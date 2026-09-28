import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import cx from '../../utils/cx.js';

/**
 * Native select wrapped for consistent chrome.
 * `options` is `[{ value, label, disabled }]` or plain strings.
 */
export const Select = forwardRef(function Select(
  { options = [], placeholder, invalid, className, size = 'md', children, ...props },
  ref,
) {
  const normalised = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cx(
          'mf-input appearance-none pr-9',
          size === 'sm' && 'h-8 py-0 text-xs',
          invalid && 'border-rose-300 focus:border-rose-400',
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalised.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
});

export default Select;

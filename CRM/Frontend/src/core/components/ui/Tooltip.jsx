import { useState } from 'react';
import cx from '../../utils/cx.js';

/** CSS-only hover tooltip — no positioning library. */
export function Tooltip({ label, side = 'top', children, className }) {
  const [open, setOpen] = useState(false);
  if (!label) return children;

  const position = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }[side];

  return (
    <span
      className={cx('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cx(
            'pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg animate-fade-in',
            position,
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}

export default Tooltip;

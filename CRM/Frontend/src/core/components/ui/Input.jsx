import { forwardRef } from 'react';
import cx from '../../utils/cx.js';

export const Input = forwardRef(function Input({ invalid, className, prefix, ...props }, ref) {
  if (prefix) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
          {prefix}
        </span>
        <input
          ref={ref}
          className={cx('mf-input pl-8', invalid && 'border-rose-300 focus:border-rose-400', className)}
          {...props}
        />
      </div>
    );
  }
  return (
    <input
      ref={ref}
      className={cx('mf-input', invalid && 'border-rose-300 focus:border-rose-400', className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea({ invalid, className, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(
        'mf-input resize-y leading-relaxed',
        invalid && 'border-rose-300 focus:border-rose-400',
        className,
      )}
      {...props}
    />
  );
});

export default Input;

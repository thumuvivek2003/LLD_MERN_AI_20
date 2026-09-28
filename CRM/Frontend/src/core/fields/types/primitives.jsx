import cx from '../../utils/cx.js';
import { Input } from '../../components/ui/Input.jsx';

/**
 * Shared building blocks reused by several field-type strategies, so a strategy
 * file stays a handful of lines. NOT a switch — each type still owns its entry.
 */

export function PlainInput({ field, value, onChange, invalid, disabled, type = 'text', ...rest }) {
  return (
    <Input
      type={type}
      value={value ?? ''}
      invalid={invalid}
      disabled={disabled}
      placeholder={field?.placeholder || `Enter ${field?.label?.toLowerCase() ?? 'value'}`}
      onChange={(event) => onChange(event.target.value)}
      {...rest}
    />
  );
}

export function PlainText({ value, className, mono = false }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-300">—</span>;
  }
  return <span className={cx(mono && 'font-mono text-[13px]', className)}>{String(value)}</span>;
}

export function LinkText({ href, label, className }) {
  if (!href) return <span className="text-slate-300">—</span>;
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={cx('mf-link break-all', className)}
    >
      {label}
    </a>
  );
}

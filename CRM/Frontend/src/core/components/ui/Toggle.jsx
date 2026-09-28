import cx from '../../utils/cx.js';

export function Toggle({ checked = false, onChange, disabled = false, size = 'md', label, ...rest }) {
  const dims =
    size === 'sm' ? { track: 'h-4 w-7', knob: 'h-3 w-3', shift: 'translate-x-3' } : { track: 'h-5 w-9', knob: 'h-4 w-4', shift: 'translate-x-4' };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      {...rest}
      className={cx(
        'relative inline-flex shrink-0 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        dims.track,
        checked ? 'bg-accent' : 'bg-slate-200',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className={cx(
          'inline-block transform rounded-full bg-white shadow transition',
          dims.knob,
          checked ? dims.shift : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

/**
 * The icon + title + description + switch row used all over the admin field
 * settings screens ("Required", "Email Format", "Unique", "Custom Regex").
 */
export function ToggleRow({ icon: Icon, title, description, checked, onChange, disabled, children }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3.5 last:border-0">
      {Icon && (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <Icon size={15} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        {children && <div className="mt-2.5">{children}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} label={title} />
    </div>
  );
}

export default Toggle;

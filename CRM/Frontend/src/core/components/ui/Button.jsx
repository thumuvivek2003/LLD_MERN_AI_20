import { Loader2 } from 'lucide-react';
import cx from '../../utils/cx.js';

const VARIANTS = {
  primary:
    'bg-accent text-white hover:brightness-95 focus-visible:ring-accent/40 shadow-sm disabled:bg-slate-300',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300',
  soft: 'bg-accent-soft text-accent-ink hover:brightness-95 focus-visible:ring-accent/30',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-300 shadow-sm',
  'danger-outline':
    'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 focus-visible:ring-rose-200',
  'warning-outline':
    'bg-white text-amber-600 border border-amber-300 hover:bg-amber-50 focus-visible:ring-amber-200',
  'accent-outline':
    'bg-white text-accent border border-accent/40 hover:bg-accent-soft focus-visible:ring-accent/30',
};

const SIZES = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-9 px-3.5 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
};

export function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const iconSize = size === 'lg' ? 17 : size === 'xs' ? 13 : 15;
  return (
    <Tag
      className={cx(
        'inline-flex select-none items-center justify-center font-semibold transition',
        'focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size],
        className,
      )}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      {...props}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        Icon && <Icon size={iconSize} strokeWidth={2.2} />
      )}
      {children}
      {IconRight && !loading && <IconRight size={iconSize} strokeWidth={2.2} />}
    </Tag>
  );
}

export function IconButton({ icon: Icon, label, size = 'md', className, ...props }) {
  const box = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cx(
        'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500',
        'transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300',
        'disabled:cursor-not-allowed disabled:opacity-50',
        box,
        className,
      )}
      {...props}
    >
      <Icon size={size === 'sm' ? 14 : 16} />
    </button>
  );
}

export default Button;

const VARIANTS = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-card disabled:bg-brand-300 disabled:cursor-not-allowed',
  secondary:
    'bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 disabled:opacity-60',
  ghost:
    'bg-transparent hover:bg-brand-50 text-slate-700 disabled:opacity-60',
  danger:
    'bg-red-500 hover:bg-red-600 text-white shadow-card disabled:bg-red-300 disabled:cursor-not-allowed'
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-2xl'
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}) {
  const classes = `${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} font-semibold inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] ${className}`;
  return (
    <button type={type} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}

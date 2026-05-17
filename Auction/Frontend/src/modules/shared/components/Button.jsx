const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  loading = false,
  disabled = false,
  ...rest
}) {
  const cls = `${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim();
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

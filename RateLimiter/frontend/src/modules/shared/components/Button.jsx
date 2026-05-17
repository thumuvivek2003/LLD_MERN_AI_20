export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
  children,
  ...rest
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn text-slate-600 hover:bg-slate-100',
  };
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? 'Working...' : children}
    </button>
  );
}

export default Button;

export function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  const variants = {
    primary: 'bg-wa-primary text-white hover:bg-wa-teal',
    dark: 'bg-wa-dark text-white hover:bg-wa-teal',
    ghost: 'bg-transparent text-wa-dark hover:bg-wa-light',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline:
      'border border-wa-dark text-wa-dark hover:bg-wa-light bg-transparent',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${sizes[size] || sizes.md} ${
        variants[variant] || variants.primary
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

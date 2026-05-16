export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: '',
    lg: 'text-base px-5 py-2.5',
  };
  return (
    <button
      className={`${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const variantCls =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'danger'
      ? 'btn-danger'
      : 'btn-secondary';
  const sizeCls = size === 'sm' ? 'text-sm px-3 py-1.5' : '';
  return (
    <button className={`${variantCls} ${sizeCls} ${className}`} {...rest}>
      {children}
    </button>
  );
}

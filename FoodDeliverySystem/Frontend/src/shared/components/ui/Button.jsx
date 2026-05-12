export const Button = ({ variant = 'primary', size = 'md', children, className = '', ...rest }) => {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: '', lg: 'px-6 py-3 text-base' };
  return (
    <button className={`${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

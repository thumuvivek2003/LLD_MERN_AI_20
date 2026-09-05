// core/components/Button.jsx — a single styled button with variants.
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-wa-green text-wa-ink px-6 py-3 hover:brightness-105 shadow-lg shadow-wa-green/20',
    ghost: 'bg-wa-panel2 text-white px-6 py-3 hover:bg-wa-line',
    danger: 'bg-red-500 text-white px-6 py-3 hover:brightness-110',
    subtle: 'text-wa-muted px-4 py-2 hover:text-white',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

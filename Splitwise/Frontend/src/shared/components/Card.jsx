export default function Card({ children, className = '', as: As = 'div', ...rest }) {
  return (
    <As
      className={`bg-white rounded-2xl border border-slate-100 shadow-soft p-4 ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}

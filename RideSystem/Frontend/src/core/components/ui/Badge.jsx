const COLORS = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-700',
};

export default function Badge({ tone = 'default', children }) {
  return <span className={`chip ${COLORS[tone] || COLORS.default}`}>{children}</span>;
}

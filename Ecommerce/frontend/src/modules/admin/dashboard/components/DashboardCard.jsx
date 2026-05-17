export default function DashboardCard({ label, value, icon = '📊', accent = 'bg-brand-light text-brand-dark' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

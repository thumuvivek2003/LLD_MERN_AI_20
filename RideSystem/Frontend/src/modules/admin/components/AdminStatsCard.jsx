export default function AdminStatsCard({ title, value, change, tone = 'indigo' }) {
  const tones = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
  };
  return (
    <div className="card">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {change && <p className={`text-xs mt-1 ${tones[tone]}`}>{change}</p>}
    </div>
  );
}

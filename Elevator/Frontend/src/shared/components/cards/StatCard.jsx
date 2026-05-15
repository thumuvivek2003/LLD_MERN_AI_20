export default function StatCard({ label, value, icon: Icon, accent = 'text-indigo-300' }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
      {Icon && <Icon className={`w-5 h-5 ${accent}`} />}
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-base font-semibold text-slate-100">{value}</div>
      </div>
    </div>
  );
}

export default function SimulationLoader({ label = 'Connecting to simulation…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
      <div className="text-sm">{label}</div>
    </div>
  );
}

import clsx from 'clsx';

export default function SimulationControlButton({ icon: Icon, label, tone = 'neutral', onClick, active = false }) {
  const tones = {
    play: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    pause: 'bg-amber-500 hover:bg-amber-600 text-white',
    reset: 'bg-rose-500 hover:bg-rose-600 text-white',
    neutral: 'bg-slate-800/70 border border-slate-700/60 hover:bg-slate-700 text-slate-100',
  };
  return (
    <button
      onClick={onClick}
      className={clsx('inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition', tones[tone], active && 'ring-2 ring-offset-1 ring-offset-slate-900 ring-indigo-400')}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label && <span>{label}</span>}
    </button>
  );
}

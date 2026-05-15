import clsx from 'clsx';

export default function IconButton({ icon: Icon, label, onClick, active = false, disabled = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border text-sm transition',
        active
          ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200'
          : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-700/60',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label && <span>{label}</span>}
    </button>
  );
}

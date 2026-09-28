import cx from '../../utils/cx.js';

const TONES = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  indigo: 'bg-indigo-500',
  accent: 'bg-accent',
};

/** Health bars, job progress, storage usage, validation-failure bars. */
export function ProgressBar({ value = 0, tone = 'emerald', size = 'md', className, label }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cx('w-full', className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>{label}</span>
          <span className="font-semibold text-slate-700">{pct.toFixed(0)}%</span>
        </div>
      )}
      <div
        className={cx('w-full overflow-hidden rounded-full bg-slate-100', size === 'sm' ? 'h-1.5' : 'h-2')}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cx('h-full rounded-full transition-all duration-500', TONES[tone] || TONES.emerald)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

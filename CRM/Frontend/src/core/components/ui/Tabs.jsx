import cx from '../../utils/cx.js';

/**
 * Underlined tab bar used by Edit Object, Edit Field, Index Details and Record Detail.
 * `tabs` = `[{ id, label, count, icon }]`. Purely presentational — the page owns state.
 */
export function Tabs({ tabs = [], active, onChange, className }) {
  return (
    <div className={cx('mf-scroll-x border-b border-slate-200', className)}>
      <nav className="-mb-px flex min-w-max gap-6" role="tablist">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange?.(tab.id)}
              className={cx(
                'flex items-center gap-2 whitespace-nowrap border-b-2 pb-2.5 pt-1 text-sm font-semibold transition',
                selected
                  ? 'border-accent text-accent'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
              )}
            >
              {Icon && <Icon size={15} />}
              {tab.label}
              {tab.count !== undefined && tab.count !== null && (
                <span
                  className={cx(
                    'rounded px-1.5 py-0.5 text-[10px] font-bold',
                    selected ? 'bg-accent-soft text-accent-ink' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/** Compact segmented control (list / grid / board switch on the business list page). */
export function SegmentedControl({ options = [], value, onChange, className }) {
  return (
    <div className={cx('inline-flex rounded-lg border border-slate-200 bg-white p-0.5', className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            title={option.label}
            aria-label={option.label}
            onClick={() => onChange?.(option.value)}
            className={cx(
              'flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition',
              selected ? 'bg-accent-soft text-accent-ink' : 'text-slate-400 hover:text-slate-600',
            )}
          >
            {Icon && <Icon size={15} />}
            {option.showLabel && option.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;

import { Check } from 'lucide-react';
import cx from '../../utils/cx.js';

/**
 * Vertical stepper rail — Create Object (3 steps) and Add Field (4 steps).
 * `steps` = `[{ id, label, hint }]`.
 */
export function Stepper({ steps = [], current = 0, onSelect, className }) {
  return (
    <ol className={cx('space-y-1', className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={index > current}
              onClick={() => onSelect?.(index)}
              className={cx(
                'flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition',
                index <= current ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default',
              )}
            >
              <span
                className={cx(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-1',
                  done && 'bg-accent text-white ring-accent',
                  active && 'bg-accent text-white ring-accent',
                  !done && !active && 'bg-white text-slate-400 ring-slate-200',
                )}
              >
                {done ? <Check size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={cx(
                    'block text-sm font-semibold',
                    active ? 'text-accent' : done ? 'text-slate-700' : 'text-slate-400',
                  )}
                >
                  {step.label}
                </span>
                {step.hint && <span className="mt-0.5 block text-[11px] text-slate-400">{step.hint}</span>}
              </span>
            </button>
            {index < steps.length - 1 && <span className="ml-5 block h-3 w-px bg-slate-200" />}
          </li>
        );
      })}
    </ol>
  );
}

/** Horizontal variant — the Bulk Operations wizard header. */
export function StepperBar({ steps = [], current = 0, className }) {
  return (
    <ol className={cx('flex items-center gap-2 overflow-x-auto', className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id} className="flex min-w-max items-center gap-2">
            <span
              className={cx(
                'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ring-1',
                done || active ? 'bg-accent text-white ring-accent' : 'bg-white text-slate-400 ring-slate-200',
              )}
            >
              {done ? <Check size={13} strokeWidth={3} /> : index + 1}
            </span>
            <span
              className={cx(
                'text-sm font-semibold',
                active ? 'text-slate-900' : done ? 'text-slate-600' : 'text-slate-400',
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && <span className="mx-2 h-px w-10 bg-slate-200 sm:w-16" />}
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;

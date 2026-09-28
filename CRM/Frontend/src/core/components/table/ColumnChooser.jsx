import { useEffect, useRef, useState } from 'react';
import { Columns3, RotateCcw } from 'lucide-react';
import cx from '../../utils/cx.js';
import { Toggle } from '../ui/Toggle.jsx';
import Button from '../ui/Button.jsx';

/**
 * "Columns ▾" popover — toggles which metadata fields appear as table columns.
 * Works purely on `fieldId`s so it round-trips into saved views unchanged.
 */
export function ColumnChooser({ fields = [], selected = [], onChange, onReset }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const toggle = (fieldId) =>
    onChange(
      selected.includes(fieldId)
        ? selected.filter((item) => item !== fieldId)
        : [...selected, fieldId],
    );

  return (
    <div className="relative" ref={ref}>
      <Button variant="secondary" size="md" icon={Columns3} onClick={() => setOpen((v) => !v)}>
        Columns
        <span className="ml-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
          {selected.length}
        </span>
      </Button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
            <span className="text-xs font-semibold text-slate-700">Visible columns</span>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {fields.map((field) => {
              const on = selected.includes(field.fieldId);
              const last = on && selected.length === 1;
              return (
                <li
                  key={field.fieldId}
                  className={cx('flex items-center justify-between gap-3 px-3.5 py-2', last && 'opacity-60')}
                >
                  <span className="truncate text-sm text-slate-700">{field.label}</span>
                  <Toggle size="sm" checked={on} disabled={last} onChange={() => toggle(field.fieldId)} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ColumnChooser;

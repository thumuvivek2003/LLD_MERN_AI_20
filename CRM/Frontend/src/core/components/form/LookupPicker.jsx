import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import lookupsApi from '../../api/lookups.api.js';
import useDebounce from '../../hooks/useDebounce.js';
import cx from '../../utils/cx.js';

/**
 * Type-ahead record picker for LOOKUP fields.
 * Queries `/lookups/options?objectId&q` and stores the selected `recordId`,
 * while showing the target record's `displayName` as a chip.
 */
export function LookupPicker({
  targetObjectId,
  value,
  displayName,
  onChange,
  disabled,
  invalid,
  placeholder = 'Search records…',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(displayName || '');
  const debounced = useDebounce(query, 300);
  const ref = useRef(null);

  useEffect(() => setLabel(displayName || ''), [displayName]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open || !targetObjectId) return;
    let alive = true;
    setLoading(true);
    lookupsApi
      .options({ objectId: targetObjectId, q: debounced || undefined, limit: 20 })
      .then((result) => alive && setOptions(Array.isArray(result) ? result : []))
      .catch(() => alive && setOptions([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [open, debounced, targetObjectId]);

  const select = (option) => {
    setLabel(option.displayName);
    onChange(option.recordId, option);
    setOpen(false);
    setQuery('');
  };

  const clear = (event) => {
    event.stopPropagation();
    setLabel('');
    onChange(null, null);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled || !targetObjectId}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          'mf-input flex items-center justify-between gap-2 text-left',
          invalid && 'border-rose-300',
          disabled && 'cursor-not-allowed bg-slate-50',
        )}
      >
        <span className={cx('truncate', value ? 'text-slate-900' : 'text-slate-400')}>
          {value ? label || value : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={clear}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown size={14} className="text-slate-400" />
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-fade-in">
          <div className="relative border-b border-slate-100">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search…"
              className="w-full border-0 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {loading && (
              <li className="flex items-center gap-2 px-3 py-3 text-xs text-slate-400">
                <Loader2 size={13} className="animate-spin" /> Searching…
              </li>
            )}
            {!loading && !options.length && (
              <li className="px-3 py-3 text-xs text-slate-400">No matching records</li>
            )}
            {!loading &&
              options.map((option) => (
                <li key={option.recordId}>
                  <button
                    type="button"
                    onClick={() => select(option)}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">{option.displayName}</span>
                    {option.secondary && (
                      <span className="text-[11px] text-slate-400">{option.secondary}</span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LookupPicker;

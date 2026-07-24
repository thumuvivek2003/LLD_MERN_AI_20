import { useMemo, useRef, useState } from 'react';
import Avatar from '../../../shared/components/Avatar.jsx';
import { CloseIcon, ChevronDownIcon } from '../../../shared/components/Icons.jsx';

/**
 * Multi-select of seeded users, rendered as chips + a dropdown.
 * @param {object[]} options   available users
 * @param {string[]} value     selected user ids
 * @param {(ids:string[])=>void} onChange
 */
export default function RecipientSelector({
  options = [],
  value = [],
  onChange,
  label = 'To',
  excludeId,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const boxRef = useRef(null);

  const available = useMemo(
    () => options.filter((u) => u.id !== excludeId),
    [options, excludeId]
  );
  const selected = available.filter((u) => value.includes(u.id));
  const filtered = available.filter(
    (u) =>
      !value.includes(u.id) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()))
  );

  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
    setQuery('');
  };

  return (
    <div className="relative" ref={boxRef}>
      <div className="flex items-center gap-2 border-b border-slate-200 py-2.5">
        <span className="w-14 shrink-0 text-sm font-medium text-slate-400">
          {label}
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {selected.map((u) => (
            <span
              key={u.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-1 pr-2 text-sm font-medium text-brand-700"
            >
              <Avatar name={u.name} color={u.avatarColor} size="xs" />
              {u.name}
              <button
                type="button"
                onClick={() => toggle(u.id)}
                className="text-brand-400 hover:text-brand-600"
              >
                <CloseIcon size={14} />
              </button>
            </span>
          ))}
          <input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={selected.length ? '' : 'Add recipients'}
            className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-slate-400 hover:text-slate-600"
        >
          <ChevronDownIcon size={18} />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute left-14 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-pop">
          {filtered.map((u) => (
            <button
              key={u.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggle(u.id)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-50"
            >
              <Avatar name={u.name} color={u.avatarColor} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-700">
                  {u.name}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {u.email}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

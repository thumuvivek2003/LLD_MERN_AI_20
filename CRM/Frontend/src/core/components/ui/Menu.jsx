import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import cx from '../../utils/cx.js';

/**
 * Click-away dropdown used for every "…" row-actions menu and the `More ▾` buttons.
 * `items` = `[{ id, label, icon, tone, disabled, onSelect }]`; `null` entries become dividers.
 */
export function Menu({ items = [], trigger, align = 'right', buttonLabel = 'Actions' }) {
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

  const visible = items.filter(Boolean);
  if (!visible.length) return null;

  return (
    <div className="relative inline-flex" ref={ref}>
      {trigger ? (
        <span onClick={() => setOpen((v) => !v)}>{trigger}</span>
      ) : (
        <button
          type="button"
          aria-label={buttonLabel}
          onClick={() => setOpen((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <MoreHorizontal size={16} />
        </button>
      )}

      {open && (
        <div
          className={cx(
            'absolute top-full z-30 mt-1 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-pop animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {visible.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                className={cx(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition',
                  item.tone === 'danger'
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-700 hover:bg-slate-50',
                  item.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                )}
              >
                {Icon && <Icon size={15} />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Menu;

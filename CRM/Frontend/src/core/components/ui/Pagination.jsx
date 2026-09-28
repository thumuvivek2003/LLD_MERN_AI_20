import { ChevronLeft, ChevronRight } from 'lucide-react';
import cx from '../../utils/cx.js';
import Select from './Select.jsx';

/** 1 2 3 … 13 with ellipses, matching the mockups' pager. */
const pageWindow = (page, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
  if (page >= totalPages - 3) {
    return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '…', page - 1, page, page + 1, '…', totalPages];
};

export function Pagination({
  page = 1,
  limit = 25,
  total = 0,
  totalPages,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 25, 50, 100],
  className,
}) {
  const pages = totalPages ?? Math.max(1, Math.ceil(total / limit));
  if (total === 0) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div
      className={cx(
        'flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3',
        className,
      )}
    >
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}</span> to{' '}
        <span className="font-semibold text-slate-700">{to}</span> of{' '}
        <span className="font-semibold text-slate-700">{total.toLocaleString('en-IN')}</span>
      </p>

      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1">
          <PagerButton disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} label="Previous">
            <ChevronLeft size={15} />
          </PagerButton>
          {pages > 1 &&
            pageWindow(page, pages).map((item, i) =>
              item === '…' ? (
                <span key={`gap-${i}`} className="px-1 text-xs text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange?.(item)}
                  className={cx(
                    'h-7 min-w-7 rounded-md px-2 text-xs font-semibold transition',
                    item === page
                      ? 'bg-accent text-white'
                      : 'text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {item}
                </button>
              ),
            )}
          <PagerButton disabled={page >= pages} onClick={() => onPageChange?.(page + 1)} label="Next">
            <ChevronRight size={15} />
          </PagerButton>
        </nav>

        {onLimitChange && (
          <Select
            size="sm"
            className="w-28"
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            options={limitOptions.map((value) => ({ value, label: `${value} / page` }))}
          />
        )}
      </div>
    </div>
  );
}

function PagerButton({ disabled, onClick, label, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export default Pagination;

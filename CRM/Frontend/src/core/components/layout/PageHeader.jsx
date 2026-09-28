import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import cx from '../../utils/cx.js';

/**
 * Title block used at the top of every page.
 * `breadcrumbs` = `[{ label, to }]`; `back` = a route string for the ← button.
 */
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  breadcrumbs = [],
  back,
  actions,
  meta,
  className,
}) {
  return (
    <header className={cx('mb-5', className)}>
      {breadcrumbs.length > 0 && (
        <nav className="mb-2 flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={11} />}
              {crumb.to ? (
                <Link to={crumb.to} className="font-medium transition hover:text-slate-600">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-500">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {back && (
            <Link
              to={back}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              aria-label="Back"
            >
              <ArrowLeft size={15} />
            </Link>
          )}
          {Icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon size={19} />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
            {meta && <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export default PageHeader;

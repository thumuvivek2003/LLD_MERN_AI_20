import cx from '../../utils/cx.js';

export function Card({ className, children, padded = false, ...props }) {
  return (
    <section className={cx('mf-card', padded && 'p-5', className)} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, actions, className, compact = false }) {
  return (
    <header
      className={cx(
        'flex flex-wrap items-start justify-between gap-3 border-b border-slate-100',
        compact ? 'px-4 py-3' : 'px-5 py-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon size={17} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className={cx('truncate font-semibold text-slate-900', compact ? 'text-sm' : 'text-[15px]')}>
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function CardBody({ className, children }) {
  return <div className={cx('p-5', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <footer className={cx('flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5', className)}>
      {children}
    </footer>
  );
}

/** The small "View All →" link that closes most system-console panels. */
export function CardLinkFooter({ children }) {
  return (
    <footer className="flex items-center justify-end border-t border-slate-100 px-5 py-2.5 text-xs font-semibold">
      {children}
    </footer>
  );
}

export default Card;

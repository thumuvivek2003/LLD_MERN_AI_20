export function Card({ title, subtitle, actions, children, className = '' }) {
  const hasHeader = title || actions;
  return (
    <div className={`card p-5 ${className}`}>
      {hasHeader && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

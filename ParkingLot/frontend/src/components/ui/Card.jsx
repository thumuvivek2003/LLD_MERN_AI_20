export const Card = ({ title, action, children, className = '' }) => (
  <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

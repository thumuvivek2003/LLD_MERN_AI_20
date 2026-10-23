export const PageContainer = ({ title, subtitle, action, children }) => (
  <div className="space-y-6">
    {(title || subtitle || action) && (
      <div className="flex items-end justify-between">
        <div>
          {title && <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>}
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

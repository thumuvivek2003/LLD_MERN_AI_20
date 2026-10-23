export function PageContainer({ title, subtitle, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {(title || actions) && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            {title && <h2 className="text-2xl font-semibold text-ink-900">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
}

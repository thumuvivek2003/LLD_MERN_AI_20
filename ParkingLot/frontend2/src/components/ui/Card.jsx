export function Card({ children, className = '', as: Tag = 'div', padded = true }) {
  return (
    <Tag
      className={[
        'rounded-2xl border border-ink-100 bg-white shadow-card',
        padded ? 'p-6' : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

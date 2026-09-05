// core/components/PageHeader.jsx — top app bar used across screens.
export function PageHeader({ title, onBack, right, subtitle }) {
  return (
    <header className="flex items-center gap-3 px-3 h-14 bg-wa-panel border-b border-wa-line shrink-0">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-1 rounded-full hover:bg-wa-panel2 text-wa-muted" aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-[17px] font-semibold leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-wa-muted truncate">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

// core/components/EmptyState.jsx — friendly empty screen (Screen 13).
export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-10 py-20 gap-3">
      <div className="h-28 w-28 rounded-full bg-wa-panel2 grid place-items-center text-5xl mb-2 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-wa-muted max-w-[240px]">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

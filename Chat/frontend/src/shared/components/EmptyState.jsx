export function EmptyState({ title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 text-3xl">{'\u{1F4AC}'}</div>
      <div className="text-base font-medium text-wa-dark">{title}</div>
      {subtitle ? (
        <div className="mt-1 text-sm text-wa-muted">{subtitle}</div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

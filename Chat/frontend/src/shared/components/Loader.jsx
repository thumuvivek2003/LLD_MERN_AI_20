export function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex w-full items-center justify-center p-6 text-sm text-wa-muted">
      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-wa-primary border-t-transparent" />
      {label}
    </div>
  );
}

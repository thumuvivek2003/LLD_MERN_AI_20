// core/components/Loader.jsx — centered spinner.
export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-wa-muted">
      <div className="h-8 w-8 rounded-full border-2 border-wa-line border-t-wa-green animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

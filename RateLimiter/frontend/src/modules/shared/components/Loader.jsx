export function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-slate-500 text-sm py-6">
      <span className="inline-block h-4 w-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      {label}
    </div>
  );
}

export default Loader;

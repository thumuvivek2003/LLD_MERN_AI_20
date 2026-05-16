export function Loader({ label = 'Loading…', size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-500">
      <span
        className={`inline-block ${sizes[size]} border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

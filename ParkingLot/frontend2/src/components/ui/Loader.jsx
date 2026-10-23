export function Loader({ size = 'md', label }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-[3px]' };
  return (
    <div className="flex items-center justify-center gap-3 text-ink-500">
      <span
        className={`inline-block animate-spin rounded-full border-ink-200 border-t-brand-600 ${sizes[size]}`}
        role="status"
        aria-label="loading"
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

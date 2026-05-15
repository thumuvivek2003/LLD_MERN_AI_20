export default function Input({
  label,
  hint,
  error,
  className = '',
  leftAddon,
  rightAddon,
  ...rest
}) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      )}
      <span
        className={`flex items-center gap-2 bg-white border ${
          error ? 'border-red-300' : 'border-slate-200'
        } rounded-xl px-3 py-2.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-colors ${className}`}
      >
        {leftAddon && <span className="text-slate-400">{leftAddon}</span>}
        <input
          className="flex-1 outline-none bg-transparent text-slate-900 placeholder-slate-400 text-sm w-full"
          {...rest}
        />
        {rightAddon && <span className="text-slate-400">{rightAddon}</span>}
      </span>
      {error ? (
        <span className="block text-xs text-red-500 mt-1">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-slate-400 mt-1">{hint}</span>
      ) : null}
    </label>
  );
}

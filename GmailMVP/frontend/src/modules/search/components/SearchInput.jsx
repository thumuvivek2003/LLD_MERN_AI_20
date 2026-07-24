import { SearchIcon, CloseIcon } from '../../../shared/components/Icons.jsx';

export default function SearchInput({ value, onChange, autoFocus }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card focus-within:ring-2 focus-within:ring-brand-200">
      <SearchIcon size={20} className="text-slate-400" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search across all emails"
        className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="rounded-md p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500"
        >
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  );
}

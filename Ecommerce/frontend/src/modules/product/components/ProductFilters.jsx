export default function ProductFilters({ categories, selected, onSelect }) {
  return (
    <aside className="card lg:sticky lg:top-20">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Categories</h3>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              !selected ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Products
          </button>
        </li>
        {categories.map((c) => (
          <li key={c}>
            <button
              onClick={() => onSelect(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition ${
                selected === c ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Generic table — columns: [{ key, header, render?, className? }]
export function Table({ columns, rows, emptyText = 'No records', onRowClick }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">{emptyText}</div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 ${c.className || ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-slate-50 ${
                onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 ${c.className || ''}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

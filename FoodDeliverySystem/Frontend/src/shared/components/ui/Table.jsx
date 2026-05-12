export const Table = ({ columns, rows = [] }) => (
  <div className="card overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((c) => (
            <th key={c.key} className="text-left px-4 py-3 font-medium text-gray-600">{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id || i} className="border-t border-gray-100 hover:bg-gray-50">
            {columns.map((c) => (
              <td key={c.key} className="px-4 py-3">
                {c.render ? c.render(row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
        {!rows.length && (
          <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">No data</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

export function Table({ columns = [], data = [], rowKey = 'id', empty = 'No records' }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-card">
      <table className="min-w-full divide-y divide-ink-100">
        <thead className="bg-ink-50/60">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-ink-500"
              >
                {empty}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row[rowKey] ?? idx} className="hover:bg-ink-50/40">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-3.5 text-sm text-ink-800">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

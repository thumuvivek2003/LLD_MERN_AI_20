import Badge from '../ui/Badge.jsx';
import { formatDate } from '../../utils/formatDate.js';

export default function RidersTable({ riders = [], onToggle }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {riders.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium">{r.name}</td>
              <td className="px-4 py-3 text-slate-600">{r.email}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(r.createdAt)}</td>
              <td className="px-4 py-3">
                {r.isBlocked ? <Badge tone="danger">Blocked</Badge> : <Badge tone="success">Active</Badge>}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onToggle?.(r)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  {r.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
          {!riders.length && (
            <tr><td colSpan={5} className="text-center py-8 text-slate-400">No riders</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

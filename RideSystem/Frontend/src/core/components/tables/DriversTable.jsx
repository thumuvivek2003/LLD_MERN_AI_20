import Badge from '../ui/Badge.jsx';
import { formatDate } from '../../utils/formatDate.js';

export default function DriversTable({ drivers = [], onToggle, onOpen }) {
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
          {drivers.map((d) => (
            <tr key={d.id} className="border-t border-slate-100 cursor-pointer hover:bg-slate-50" onClick={() => onOpen?.(d)}>
              <td className="px-4 py-3 font-medium">{d.name}</td>
              <td className="px-4 py-3 text-slate-600">{d.email}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(d.createdAt)}</td>
              <td className="px-4 py-3">
                {d.isBlocked ? <Badge tone="danger">Blocked</Badge> : <Badge tone="success">Active</Badge>}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle?.(d); }}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  {d.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
          {!drivers.length && (
            <tr><td colSpan={5} className="text-center py-8 text-slate-400">No drivers</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

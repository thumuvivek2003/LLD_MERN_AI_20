import RideStatusBadge from '../ride/RideStatusBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function RidesTable({ rides = [], onOpen }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Rider</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Fare</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((r) => (
            <tr key={r.id} className="border-t border-slate-100 cursor-pointer hover:bg-slate-50" onClick={() => onOpen?.(r)}>
              <td className="px-4 py-3 text-slate-500">{formatDate(r.createdAt)}</td>
              <td className="px-4 py-3 font-medium">{r.rider?.name || '—'}</td>
              <td className="px-4 py-3">{r.driver?.name || <span className="text-slate-400">Unassigned</span>}</td>
              <td className="px-4 py-3 font-semibold">{formatCurrency(r.fare)}</td>
              <td className="px-4 py-3"><RideStatusBadge status={r.status} /></td>
            </tr>
          ))}
          {!rides.length && (
            <tr><td colSpan={5} className="text-center py-8 text-slate-400">No rides</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

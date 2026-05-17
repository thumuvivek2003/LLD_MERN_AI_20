import { Link } from 'react-router-dom';
import Button from '../../../../shared/components/Button.jsx';
import CouponStatusToggle from './CouponStatusToggle.jsx';

export default function CouponTable({ coupons, loading, onToggle, onDelete }) {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Value</th>
            <th className="px-4 py-3 font-semibold">Min Cart</th>
            <th className="px-4 py-3 font-semibold">Assigned</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c, i) => {
            const assignedCount = c.assignedUserIds?.length || 0;
            return (
              <tr key={c._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                <td className="px-4 py-3 font-mono font-semibold text-brand-dark">{c.code}</td>
                <td className="px-4 py-3 capitalize">{c.type.replace('_', ' ')}</td>
                <td className="px-4 py-3">
                  {c.type === 'percentage' ? `${c.value}%` : c.type === 'flat' ? `₹${c.value}` : '—'}
                </td>
                <td className="px-4 py-3">₹{c.minCartValue || 0}</td>
                <td className="px-4 py-3">
                  {assignedCount > 0 ? (
                    <span className="chip bg-indigo-100 text-indigo-700">{assignedCount} user(s)</span>
                  ) : (
                    <span className="chip bg-slate-100 text-slate-700">Global</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`chip ${c.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end items-center gap-2 flex-wrap">
                    <CouponStatusToggle coupon={c} loading={loading} onToggle={onToggle} />
                    <Link to={`/admin/coupons/${c._id}/edit`}>
                      <Button size="sm" variant="secondary" disabled={loading}>Edit</Button>
                    </Link>
                    <Link to={`/admin/coupons/${c._id}`}>
                      <Button size="sm" variant="secondary" disabled={loading}>View</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={loading}
                      onClick={() => onDelete && onDelete(c)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

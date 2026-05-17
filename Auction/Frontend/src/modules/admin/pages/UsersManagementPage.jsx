import { useEffect, useState } from 'react';
import { adminAuctionApi } from '../services/adminAuction.api.js';
import Loader from '../../shared/components/Loader.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAuctionApi
      .getUsers()
      .then((d) => setUsers(d.users || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Users</h1>
        <p className="text-sm text-slate-500">All registered users in the system.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-right px-4 py-3">Wallet</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="badge bg-brand-50 text-brand-700">{u.role}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.walletBalance !== undefined
                    ? formatCurrency(u.walletBalance)
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

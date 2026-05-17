import { Link } from 'react-router-dom';
import Button from '../../../../shared/components/Button.jsx';
import UserStatusToggle from './UserStatusToggle.jsx';

export default function UserTable({ users, loading, onBlock, onUnblock }) {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
              <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
              <td className="px-4 py-3 text-slate-600">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role}</td>
              <td className="px-4 py-3">
                <span
                  className={`chip ${u.blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                >
                  {u.blocked ? 'Blocked' : 'Active'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end items-center gap-2 flex-wrap">
                  <Link to={`/admin/users/${u._id}`}>
                    <Button size="sm" variant="secondary" disabled={loading}>View</Button>
                  </Link>
                  {u.role !== 'admin' && (
                    <UserStatusToggle user={u} loading={loading} onBlock={onBlock} onUnblock={onUnblock} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

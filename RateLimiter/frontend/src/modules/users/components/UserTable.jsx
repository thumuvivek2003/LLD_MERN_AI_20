import { UserStatusBadge } from './UserStatusBadge.jsx';
import { UserActions } from './UserActions.jsx';
import {
  formatNumber,
  formatRelative,
} from '../../shared/utils/format.util.js';

export function UserTable({ users = [], onReset, onBlock, onUnblock, busy }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-slate-500">
            <th className="py-2 pr-4">Client ID</th>
            <th className="py-2 pr-4">Username</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Requests</th>
            <th className="py-2 pr-4">Allowed</th>
            <th className="py-2 pr-4">Blocked</th>
            <th className="py-2 pr-4">Last Seen</th>
            <th className="py-2 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u._id || u.clientId}>
              <td className="py-2 pr-4 text-xs text-slate-500">
                {u.clientId}
              </td>
              <td className="py-2 pr-4 font-medium text-slate-700">
                {u.username}
              </td>
              <td className="py-2 pr-4">
                <UserStatusBadge status={u.status} />
              </td>
              <td className="py-2 pr-4">{formatNumber(u.requests)}</td>
              <td className="py-2 pr-4 text-emerald-600">
                {formatNumber(u.allowed)}
              </td>
              <td className="py-2 pr-4 text-red-600">
                {formatNumber(u.blocked)}
              </td>
              <td className="py-2 pr-4 text-xs text-slate-400">
                {formatRelative(u.lastSeen)}
              </td>
              <td className="py-2 pr-4">
                <UserActions
                  user={u}
                  onReset={onReset}
                  onBlock={onBlock}
                  onUnblock={onUnblock}
                  busy={busy === u.clientId}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

import { Avatar } from '../../../shared/components/Avatar.jsx';
import { UserActionMenu } from './UserActionMenu.jsx';
import { formatChatListTime } from '../../../shared/utils/format-date.util.js';

export function UserTable({ users = [], onBlock, onUnblock, onView }) {
  return (
    <div className="overflow-hidden rounded-lg border border-wa-border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-wa-light text-left text-xs uppercase tracking-wide text-wa-muted">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last seen</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-wa-muted" colSpan={6}>
                No users yet
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t border-wa-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} online={u.isOnline} />
                    <div>
                      <div className="font-medium text-wa-dark">{u.name}</div>
                      <div className="text-xs text-wa-muted">{u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">+91 {u.mobile}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">
                  {u.isBlocked ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                      blocked
                    </span>
                  ) : u.isOnline ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">
                      online
                    </span>
                  ) : (
                    <span className="rounded-full bg-wa-light px-2 py-0.5 text-xs text-wa-muted">
                      offline
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-wa-muted">
                  {u.isOnline ? '—' : formatChatListTime(u.lastSeen)}
                </td>
                <td className="px-4 py-3">
                  <UserActionMenu
                    user={u}
                    onBlock={onBlock}
                    onUnblock={onUnblock}
                    onView={onView}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

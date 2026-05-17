import { Avatar } from '../../../shared/components/Avatar.jsx';
import { formatChatListTime } from '../../../shared/utils/format-date.util.js';

export function GroupTable({ groups = [] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-wa-border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-wa-light text-left text-xs uppercase tracking-wide text-wa-muted">
          <tr>
            <th className="px-4 py-3">Group</th>
            <th className="px-4 py-3">Members</th>
            <th className="px-4 py-3">Created by</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-wa-muted" colSpan={4}>
                No groups yet
              </td>
            </tr>
          ) : (
            groups.map((g) => (
              <tr key={g.id} className="border-t border-wa-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={g.name} />
                    <div className="font-medium text-wa-dark">{g.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{g.members?.length ?? 0}</td>
                <td className="px-4 py-3 text-xs text-wa-muted">
                  {g.createdBy}
                </td>
                <td className="px-4 py-3 text-xs text-wa-muted">
                  {formatChatListTime(g.updatedAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

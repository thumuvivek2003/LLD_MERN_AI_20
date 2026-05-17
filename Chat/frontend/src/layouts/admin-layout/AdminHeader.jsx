import { useAuth } from '../../modules/auth/hooks/useAuth.js';
import { Avatar } from '../../shared/components/Avatar.jsx';

export function AdminHeader() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-between border-b border-wa-border bg-white px-4 py-3 shadow-sm">
      <div className="text-base font-semibold text-wa-dark">Admin Console</div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-wa-muted">{user?.name}</span>
        <Avatar name={user?.name} size={32} />
      </div>
    </div>
  );
}

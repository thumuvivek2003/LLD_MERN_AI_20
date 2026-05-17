import { useAuth } from '../../modules/auth/hooks/useAuth.js';
import { Avatar } from '../../shared/components/Avatar.jsx';

export function UserHeader() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-between border-b border-wa-border bg-wa-dark px-4 py-2 text-white">
      <div className="text-sm font-semibold">Chat MVP</div>
      <div className="flex items-center gap-2 text-sm">
        <span>{user?.name}</span>
        <Avatar name={user?.name} size={32} />
      </div>
    </div>
  );
}

// modules/auth/components/UserList.jsx — renders the list of selectable users.
import { UserCard } from './UserCard.jsx';

export function UserList({ users, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-1 px-2">
      {users.map((u) => (
        <UserCard key={u.id} user={u} selected={selectedId === u.id} onSelect={onSelect} />
      ))}
    </div>
  );
}

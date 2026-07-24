import UserCard from './UserCard.jsx';

export default function UserList({ users, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-2.5">
      {users.map((u) => (
        <UserCard
          key={u.id}
          user={u}
          selected={u.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

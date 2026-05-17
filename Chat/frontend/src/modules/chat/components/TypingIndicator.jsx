export function TypingIndicator({ users = [] }) {
  if (!users.length) return null;
  const label =
    users.length === 1
      ? `${users[0].userName} is typing...`
      : `${users.map((u) => u.userName).join(', ')} are typing...`;
  return (
    <div className="px-1 text-xs italic text-wa-primary">{label}</div>
  );
}

export function UserStatusBadge({ status }) {
  const safe = (status || 'active').toLowerCase();
  const tone =
    safe === 'blocked'
      ? 'bg-red-50 text-red-700'
      : safe === 'inactive'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-emerald-50 text-emerald-700';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${tone}`}>{safe}</span>
  );
}

export default UserStatusBadge;

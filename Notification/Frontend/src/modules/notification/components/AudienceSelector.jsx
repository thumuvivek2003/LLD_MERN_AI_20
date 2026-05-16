import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/notification.service.js';
import { Loader } from '../../../shared/components/Loader.jsx';

export function AudienceSelector({ selected = [], onChange, multi = true }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchUsers()
      .then((d) => {
        if (cancelled) return;
        const items = Array.isArray(d) ? d : d?.items || [];
        setUsers(items);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loader label="Loading users…" size="sm" />;
  if (error)
    return <div className="text-sm text-red-600 py-3">{error}</div>;

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q)
    );
  });

  function toggle(id) {
    if (multi) {
      onChange(
        selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id],
      );
    } else {
      onChange([id]);
    }
  }

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users…"
        className="input"
      />
      <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-xl divide-y">
        {filtered.length === 0 && (
          <div className="text-sm text-slate-400 p-4">No users found.</div>
        )}
        {filtered.map((u) => {
          const checked = selected.includes(u.id);
          return (
            <label
              key={u.id}
              className={`flex items-center gap-3 p-3 cursor-pointer ${
                checked ? 'bg-brand-50' : 'hover:bg-slate-50'
              }`}
            >
              <input
                type={multi ? 'checkbox' : 'radio'}
                checked={checked}
                onChange={() => toggle(u.id)}
                className="accent-brand-600"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800">
                  {u.name || u.id}
                </div>
                <div className="text-xs text-slate-500">
                  {u.email} · {u.phone}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
            </label>
          );
        })}
      </div>
      {multi && (
        <div className="text-xs text-slate-500">
          {selected.length} user(s) selected
        </div>
      )}
    </div>
  );
}

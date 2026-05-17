import { useState } from 'react';
import { Input } from '../../../shared/components/Input.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Avatar } from '../../../shared/components/Avatar.jsx';

export function CreateGroupForm({ users = [], onSubmit, loading }) {
  const [name, setName] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [error, setError] = useState(null);

  function toggle(id) {
    setMemberIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }
    if (memberIds.length === 0) {
      setError('Pick at least one member');
      return;
    }
    await onSubmit({ name: name.trim(), memberIds });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Project Sprint"
      />

      <div>
        <div className="mb-2 text-sm text-wa-muted">
          Add members ({memberIds.length} selected)
        </div>
        <div className="max-h-72 overflow-y-auto rounded border border-wa-border">
          {users.length === 0 ? (
            <div className="py-6 text-center text-sm text-wa-muted">
              No contacts available
            </div>
          ) : (
            users.map((u) => (
              <label
                key={u.id}
                className="flex cursor-pointer items-center gap-3 border-b border-wa-border px-3 py-2 last:border-0 hover:bg-wa-light"
              >
                <input
                  type="checkbox"
                  checked={memberIds.includes(u.id)}
                  onChange={() => toggle(u.id)}
                />
                <Avatar name={u.name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-wa-dark">
                    {u.name}
                  </div>
                  <div className="text-xs text-wa-muted">+91 {u.mobile}</div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {error ? <div className="text-xs text-red-500">{error}</div> : null}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create group'}
      </Button>
    </form>
  );
}

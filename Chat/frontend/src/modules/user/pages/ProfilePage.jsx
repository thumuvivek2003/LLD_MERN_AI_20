import { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { updateProfile } from '../services/user.service.js';
import { Avatar } from '../../../shared/components/Avatar.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Button } from '../../../shared/components/Button.jsx';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const updated = await updateProfile({ name: name.trim() });
      updateUser(updated);
      setMsg({ type: 'ok', text: 'Profile updated' });
    } catch (err) {
      setMsg({ type: 'err', text: err.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="border-b border-wa-border bg-wa-light px-4 py-3 text-xs font-semibold uppercase tracking-wide text-wa-muted">
        Profile
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={user?.name} size={72} />
          <div>
            <div className="text-lg font-semibold text-wa-dark">
              {user?.name}
            </div>
            <div className="text-sm text-wa-muted">+91 {user?.mobile}</div>
            <div className="text-xs text-wa-muted">Role: {user?.role}</div>
          </div>
        </div>

        <form onSubmit={handleSave} className="max-w-md space-y-4">
          <Input
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Mobile"
            value={user?.mobile || ''}
            disabled
            readOnly
          />
          {msg ? (
            <div
              className={`text-xs ${
                msg.type === 'ok' ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {msg.text}
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button type="button" variant="danger" onClick={signOut}>
              Logout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

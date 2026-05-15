import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Modal from '../../../shared/components/Modal.jsx';
import Button from '../../../shared/components/Button.jsx';
import Input from '../../../shared/components/Input.jsx';
import Avatar from '../../../shared/components/Avatar.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import { api } from '../../../shared/api.js';

export default function AddMemberModal({ open, onClose, existingMemberIds = [], onAdd }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const data = await api.listUsers();
        if (mounted) setUsers(data.users || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open]);

  const excluded = new Set(existingMemberIds);
  const filtered = users
    .filter((u) => !excluded.has(u.userId))
    .filter((u) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

  const handleAdd = async (user) => {
    setAdding(user.userId);
    try {
      await onAdd(user);
    } finally {
      setAdding(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add member">
      <Input
        leftAddon={<Search className="w-4 h-4" />}
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
        {loading ? (
          <Loader label="Loading users..." />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No users to add.</p>
        ) : (
          filtered.map((u) => (
            <div
              key={u.userId}
              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100"
            >
              <Avatar name={u.name} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 truncate">{u.name}</div>
                <div className="text-xs text-slate-500 truncate">{u.email}</div>
              </div>
              <Button
                size="sm"
                onClick={() => handleAdd(u)}
                disabled={adding === u.userId}
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

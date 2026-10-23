import { useState } from 'react';
import { useBoardStore } from '../../../store/useBoardStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function CreateBoardModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const addBoard = useBoardStore((s) => s.addBoard);
  const user = useAuthStore((s) => s.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;
    addBoard({
      name: name.trim(),
      description: desc.trim(),
      ownerId: user.id,
      members: [{ userId: user.id, userName: user.name, role: 'owner', avatarColor: user.avatarColor }],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-lg border shadow-lg w-full max-w-md p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Create Board</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

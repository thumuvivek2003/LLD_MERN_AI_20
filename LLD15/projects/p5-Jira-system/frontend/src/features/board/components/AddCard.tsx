import { useState } from 'react';
import { useBoardStore } from '../../../store/useBoardStore';
import { Plus } from 'lucide-react';

interface Props {
  columnId: string;
  boardId: string;
}

export function AddCard({ columnId, boardId }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const addCard = useBoardStore((s) => s.addCard);

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 rounded-md hover:bg-muted/50 transition-colors"
      >
        <Plus className="w-3 h-3" /> Add card
      </button>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-2 animate-fade-in">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
            e.preventDefault();
            addCard(columnId, boardId, title.trim());
            setTitle('');
          }
          if (e.key === 'Escape') { setAdding(false); setTitle(''); }
        }}
        placeholder="Card title..."
        className="w-full text-sm resize-none bg-transparent focus:outline-none"
        rows={2}
      />
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => {
            if (title.trim()) addCard(columnId, boardId, title.trim());
            setTitle('');
            setAdding(false);
          }}
          className="rounded px-2 py-1 text-xs bg-primary text-primary-foreground hover:opacity-90 transition-all"
        >
          Add
        </button>
        <button
          onClick={() => { setAdding(false); setTitle(''); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

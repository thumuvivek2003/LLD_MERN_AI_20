import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useBoardStore } from '../../../store/useBoardStore';
import { useUIStore } from '../../../store/useUIStore';
import { BoardHeader } from '../components/BoardHeader';
import { ColumnComponent } from '../components/Column';
import { CardModal } from '../modals/CardModal';

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const boards = useBoardStore((s) => s.boards);
  const columns = useBoardStore((s) => s.columns);
  const isCardModalOpen = useUIStore((s) => s.isCardModalOpen);

  if (!user) { navigate('/login'); return null; }

  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground text-sm">Board not found</p>
          <button onClick={() => navigate('/dashboard')} className="text-primary text-sm mt-2 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const boardColumns = columns
    .filter((c) => c.boardId === boardId)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="h-screen flex flex-col bg-background">
      <BoardHeader board={board} />
      <div className="flex-1 overflow-x-auto p-4 scrollbar-thin">
        <div className="flex gap-4 h-full min-w-max">
          {boardColumns.map((col, i) => (
            <div key={col.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <ColumnComponent column={col} boardId={board.id} />
            </div>
          ))}
          <AddColumnButton boardId={board.id} />
        </div>
      </div>
      {isCardModalOpen && <CardModal boardId={board.id} />}
    </div>
  );
}

function AddColumnButton({ boardId }: { boardId: string }) {
  const addColumn = useBoardStore((s) => s.addColumn);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="w-64 shrink-0 h-10 rounded-lg border border-dashed text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
      >
        + Add Column
      </button>
    );
  }

  return (
    <div className="w-64 shrink-0">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && title.trim()) {
            addColumn(boardId, title.trim());
            setTitle('');
            setAdding(false);
          }
          if (e.key === 'Escape') setAdding(false);
        }}
        onBlur={() => {
          if (title.trim()) addColumn(boardId, title.trim());
          setTitle('');
          setAdding(false);
        }}
        placeholder="Column name..."
        className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

import { useState } from 'react';

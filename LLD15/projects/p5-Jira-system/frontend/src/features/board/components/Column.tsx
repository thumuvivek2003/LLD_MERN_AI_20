import { useState } from 'react';
import { Column } from '../../../utils/types';
import { useBoardStore } from '../../../store/useBoardStore';
import { CardComponent } from './Card';
import { AddCard } from './AddCard';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';

interface Props {
  column: Column;
  boardId: string;
}

export function ColumnComponent({ column, boardId }: Props) {
  const cards = useBoardStore((s) => s.cards)
    .filter((c) => c.columnId === column.id)
    .sort((a, b) => a.position - b.position);
  const deleteColumn = useBoardStore((s) => s.deleteColumn);
  const updateColumn = useBoardStore((s) => s.updateColumn);
  const moveCard = useBoardStore((s) => s.moveCard);
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      moveCard(cardId, column.id, cards.length);
    }
  };

  return (
    <div
      className="w-64 shrink-0 flex flex-col max-h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-2 py-2 mb-1">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => { updateColumn(column.id, title.trim() || column.title); setEditing(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { updateColumn(column.id, title.trim() || column.title); setEditing(false); }
              if (e.key === 'Escape') { setTitle(column.title); setEditing(false); }
            }}
            className="text-xs font-semibold uppercase tracking-wider bg-transparent border-b border-primary focus:outline-none w-full"
          />
        ) : (
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {column.title}
            <span className="ml-1.5 text-[10px] font-normal">{cards.length}</span>
          </h3>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-card border rounded-md shadow-md z-10 py-1 min-w-[120px] animate-fade-in">
              <button
                onClick={() => { setEditing(true); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted flex items-center gap-2 transition-colors"
              >
                <Pencil className="w-3 h-3" /> Rename
              </button>
              <button
                onClick={() => { deleteColumn(column.id); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-destructive hover:bg-muted flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-2 scrollbar-thin">
        {cards.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}
        <AddCard columnId={column.id} boardId={boardId} />
      </div>
    </div>
  );
}

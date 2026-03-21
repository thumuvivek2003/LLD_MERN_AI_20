import { useBoardStore } from '../../../store/useBoardStore';
import { useState } from 'react';
import { LABEL_COLORS } from '../../../utils/constants';
import { Plus, Check } from 'lucide-react';

interface Props {
  cardId: string;
  boardId: string;
}

export function LabelSelector({ cardId, boardId }: Props) {
  const labels = useBoardStore((s) => s.labels).filter((l) => l.boardId === boardId);
  const card = useBoardStore((s) => s.cards).find((c) => c.id === cardId);
  const toggleCardLabel = useBoardStore((s) => s.toggleCardLabel);
  const addLabel = useBoardStore((s) => s.addLabel);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(LABEL_COLORS[0].value);

  return (
    <div className="border rounded-md p-3 bg-muted/30 space-y-2 animate-fade-in">
      {labels.map((label) => {
        const isActive = card?.labels.some((l) => l.id === label.id);
        return (
          <button
            key={label.id}
            onClick={() => toggleCardLabel(cardId, label.id)}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4 rounded" style={{ backgroundColor: label.color }} />
            <span className="text-xs flex-1">{label.name}</span>
            {isActive && <Check className="w-3 h-3 text-primary" />}
          </button>
        );
      })}
      <div className="flex gap-1.5 pt-1 border-t">
        <div className="flex gap-1">
          {LABEL_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setNewColor(c.value)}
              className={`w-4 h-4 rounded ${newColor === c.value ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Label name"
          className="flex-1 text-xs border rounded px-2 py-1 bg-background focus:outline-none"
        />
        <button
          onClick={() => {
            if (newName.trim()) { addLabel(boardId, newName.trim(), newColor); setNewName(''); }
          }}
          className="text-primary hover:opacity-70"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

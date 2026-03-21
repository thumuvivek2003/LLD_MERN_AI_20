import { Board } from '../../../utils/types';
import { Users } from 'lucide-react';

interface Props {
  board: Board;
  onClick: () => void;
}

export function BoardCard({ board, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-lg border p-4 hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all group"
    >
      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{board.name}</h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{board.description || 'No description'}</p>
      <div className="flex items-center gap-2 mt-3">
        <div className="flex -space-x-1.5">
          {board.members.slice(0, 4).map((m) => (
            <div
              key={m.userId}
              className="w-5 h-5 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-medium text-primary-foreground"
              style={{ backgroundColor: m.avatarColor }}
            >
              {m.userName.charAt(0)}
            </div>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
          <Users className="w-3 h-3" /> {board.members.length}
        </span>
      </div>
    </button>
  );
}

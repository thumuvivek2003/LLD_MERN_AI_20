import { useNavigate } from 'react-router-dom';
import { Board } from '../../../utils/types';
import { ArrowLeft, Users } from 'lucide-react';

interface Props {
  board: Board;
}

export function BoardHeader({ board }: Props) {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card px-4 py-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-semibold text-sm">{board.name}</h1>
        {board.description && (
          <span className="text-xs text-muted-foreground hidden sm:inline">— {board.description}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {board.members.slice(0, 5).map((m) => (
            <div
              key={m.userId}
              className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-medium text-primary-foreground"
              style={{ backgroundColor: m.avatarColor }}
              title={m.userName}
            >
              {m.userName.charAt(0)}
            </div>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
          <Users className="w-3 h-3" /> {board.members.length}
        </span>
      </div>
    </header>
  );
}

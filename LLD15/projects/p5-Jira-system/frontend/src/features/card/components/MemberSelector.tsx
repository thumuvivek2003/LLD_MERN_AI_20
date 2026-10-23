import { useBoardStore } from '../../../store/useBoardStore';
import { getAllUsers } from '../../../store/useAuthStore';
import { Check } from 'lucide-react';

interface Props {
  cardId: string;
  boardId: string;
}

export function MemberSelector({ cardId, boardId }: Props) {
  const board = useBoardStore((s) => s.boards).find((b) => b.id === boardId);
  const card = useBoardStore((s) => s.cards).find((c) => c.id === cardId);
  const toggleCardMember = useBoardStore((s) => s.toggleCardMember);
  const allUsers = getAllUsers();

  if (!board || !card) return null;

  const boardUserIds = board.members.map((m) => m.userId);
  const boardUsers = allUsers.filter((u) => boardUserIds.includes(u.id));

  return (
    <div className="border rounded-md p-3 bg-muted/30 space-y-1 animate-fade-in">
      {boardUsers.map((user) => {
        const isAssigned = card.members.includes(user.id);
        return (
          <button
            key={user.id}
            onClick={() => toggleCardMember(cardId, user.id)}
            className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-muted transition-colors"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium text-primary-foreground"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0)}
            </div>
            <span className="text-xs flex-1">{user.name}</span>
            {isAssigned && <Check className="w-3 h-3 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}

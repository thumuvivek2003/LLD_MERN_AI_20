import { Card } from '../../../utils/types';
import { useUIStore } from '../../../store/useUIStore';
import { getAllUsers } from '../../../store/useAuthStore';
import { MessageSquare } from 'lucide-react';

interface Props {
  card: Card;
}

export function CardComponent({ card }: Props) {
  const openCardModal = useUIStore((s) => s.openCardModal);
  const allUsers = getAllUsers();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => openCardModal(card)}
      className="bg-card rounded-lg border p-3 cursor-pointer hover:shadow-md hover:border-primary/20 active:scale-[0.98] transition-all group"
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="h-1.5 w-8 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      <p className="text-sm font-medium leading-snug">{card.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          {card.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MessageSquare className="w-3 h-3" /> {card.comments.length}
            </span>
          )}
        </div>
        <div className="flex -space-x-1">
          {card.members.slice(0, 3).map((memberId) => {
            const u = allUsers.find((u) => u.id === memberId);
            if (!u) return null;
            return (
              <div
                key={memberId}
                className="w-5 h-5 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-medium text-primary-foreground"
                style={{ backgroundColor: u.avatarColor }}
                title={u.name}
              >
                {u.name.charAt(0)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

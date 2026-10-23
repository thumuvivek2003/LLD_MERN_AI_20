import { useState } from 'react';
import { useBoardStore } from '../../../store/useBoardStore';
import { useUIStore } from '../../../store/useUIStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { getAllUsers } from '../../../store/useAuthStore';
import { CommentList } from '../../card/components/CommentList';
import { CommentInput } from '../../card/components/CommentInput';
import { LabelSelector } from '../../card/components/LabelSelector';
import { MemberSelector } from '../../card/components/MemberSelector';
import { X, Trash2, Tag, Users } from 'lucide-react';

interface Props {
  boardId: string;
}

export function CardModal({ boardId }: Props) {
  const selectedCard = useUIStore((s) => s.selectedCard);
  const closeCardModal = useUIStore((s) => s.closeCardModal);
  const updateCard = useBoardStore((s) => s.updateCard);
  const deleteCard = useBoardStore((s) => s.deleteCard);
  const cards = useBoardStore((s) => s.cards);
  const user = useAuthStore((s) => s.user);

  const card = cards.find((c) => c.id === selectedCard?.id);

  const [title, setTitle] = useState(card?.title ?? '');
  const [desc, setDesc] = useState(card?.description ?? '');
  const [showLabels, setShowLabels] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  if (!card) return null;

  const handleSave = () => {
    updateCard(card.id, { title: title.trim() || card.title, description: desc });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-foreground/20 backdrop-blur-sm" onClick={closeCardModal}>
      <div
        className="bg-card rounded-lg border shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="text-sm font-semibold bg-transparent focus:outline-none focus:border-b focus:border-primary w-full mr-2"
          />
          <button onClick={closeCardModal} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full text-primary-foreground"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {card.members.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground mr-1">Members:</span>
              {card.members.map((memberId) => {
                const u = getAllUsers().find((u) => u.id === memberId);
                if (!u) return null;
                return (
                  <div
                    key={memberId}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-primary-foreground"
                    style={{ backgroundColor: u.avatarColor }}
                    title={u.name}
                  >
                    {u.name.charAt(0)}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-muted transition-colors"
            >
              <Tag className="w-3 h-3" /> Labels
            </button>
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-muted transition-colors"
            >
              <Users className="w-3 h-3" /> Members
            </button>
            <button
              onClick={() => { deleteCard(card.id); closeCardModal(); }}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded border text-destructive hover:bg-destructive/10 transition-colors ml-auto"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>

          {showLabels && <LabelSelector cardId={card.id} boardId={boardId} />}
          {showMembers && <MemberSelector cardId={card.id} boardId={boardId} />}

          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={handleSave}
              placeholder="Add a description..."
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[80px]"
            />
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Comments</h4>
            {user && <CommentInput cardId={card.id} userId={user.id} userName={user.name} />}
            <CommentList comments={card.comments} cardId={card.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useBoardStore } from '../../../store/useBoardStore';
import { Send } from 'lucide-react';

interface Props {
  cardId: string;
  userId: string;
  userName: string;
  parentId?: string;
  onDone?: () => void;
}

export function CommentInput({ cardId, userId, userName, parentId, onDone }: Props) {
  const [content, setContent] = useState('');
  const addComment = useBoardStore((s) => s.addComment);

  const handleSubmit = () => {
    if (!content.trim()) return;
    addComment(cardId, userId, userName, content.trim(), parentId);
    setContent('');
    onDone?.();
  };

  return (
    <div className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        placeholder="Write a comment..."
        className="flex-1 text-xs border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <button
        onClick={handleSubmit}
        className="text-primary hover:opacity-70 transition-opacity"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

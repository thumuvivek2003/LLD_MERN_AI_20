import { Comment } from '../../../utils/types';
import { useAuthStore } from '../../../store/useAuthStore';
import { useBoardStore } from '../../../store/useBoardStore';
import { CommentInput } from './CommentInput';
import { useState } from 'react';
import { Reply } from 'lucide-react';

interface Props {
  comments: Comment[];
  cardId: string;
  parentId?: string;
  depth?: number;
}

export function CommentList({ comments, cardId, parentId = null as any, depth = 0 }: Props) {
  const topLevel = comments.filter((c) => c.parentId === parentId);

  if (topLevel.length === 0) return null;

  return (
    <div className={depth > 0 ? 'ml-4 border-l pl-3' : ''}>
      {topLevel.map((comment) => (
        <CommentItem key={comment.id} comment={comment} allComments={comments} cardId={cardId} depth={depth} />
      ))}
    </div>
  );
}

function CommentItem({ comment, allComments, cardId, depth }: { comment: Comment; allComments: Comment[]; cardId: string; depth: number }) {
  const [replying, setReplying] = useState(false);
  const user = useAuthStore((s) => s.user);
  const replies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <div className="py-2">
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground shrink-0 mt-0.5">
          {comment.userName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{comment.userName}</span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-foreground/80 mt-0.5">{comment.content}</p>
          {depth < 3 && (
            <button
              onClick={() => setReplying(!replying)}
              className="text-[10px] text-muted-foreground hover:text-foreground mt-1 flex items-center gap-0.5 transition-colors"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
          )}
        </div>
      </div>
      {replying && user && (
        <div className="ml-7 mt-2">
          <CommentInput cardId={cardId} userId={user.id} userName={user.name} parentId={comment.id} onDone={() => setReplying(false)} />
        </div>
      )}
      {replies.length > 0 && <CommentList comments={allComments} cardId={cardId} parentId={comment.id} depth={depth + 1} />}
    </div>
  );
}

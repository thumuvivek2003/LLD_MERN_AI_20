import { useEffect, useRef, useState } from 'react';
import Avatar from '../../../shared/components/Avatar.jsx';
import Button from '../../../shared/components/Button.jsx';
import { SendIcon, CloseIcon } from '../../../shared/components/Icons.jsx';

/**
 * Inline reply composer shown under an open email / thread.
 */
export default function ReplyEditor({
  currentUser,
  replyingTo,
  onSubmit,
  onCancel,
  sending,
}) {
  const [body, setBody] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit(body.trim());
    setBody('');
  };

  return (
    <form
      onSubmit={submit}
      className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-soft"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-brand-50/50 px-4 py-2.5 text-sm">
        <Avatar
          name={currentUser?.name}
          color={currentUser?.avatarColor}
          size="xs"
        />
        <span className="text-slate-500">
          Reply {replyingTo ? `to ${replyingTo}` : ''}
        </span>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-200/60"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
      <textarea
        ref={ref}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        placeholder="Write your reply…"
        className="w-full resize-none px-4 py-3 text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none"
      />
      <div className="flex items-center justify-end border-t border-slate-100 px-4 py-3">
        <Button
          type="submit"
          leftIcon={SendIcon}
          size="sm"
          loading={sending}
          disabled={!body.trim()}
        >
          Send reply
        </Button>
      </div>
    </form>
  );
}

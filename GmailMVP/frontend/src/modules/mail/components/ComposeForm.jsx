import { useState } from 'react';
import RecipientSelector from './RecipientSelector.jsx';
import Button from '../../../shared/components/Button.jsx';
import { SendIcon, CloseIcon } from '../../../shared/components/Icons.jsx';

export default function ComposeForm({
  users,
  currentUserId,
  onSend,
  onCancel,
  sending,
}) {
  const [to, setTo] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [touched, setTouched] = useState(false);

  const canSend = to.length > 0 && body.trim().length > 0;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!canSend) return;
    onSend({ to, subject: subject.trim(), body: body.trim() });
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-700">New Message</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      <div className="px-5">
        <RecipientSelector
          options={users}
          value={to}
          onChange={setTo}
          excludeId={currentUserId}
          label="To"
        />
        {touched && to.length === 0 && (
          <p className="pt-1 text-xs text-red-500">Add at least one recipient.</p>
        )}

        <div className="flex items-center gap-2 border-b border-slate-200 py-2.5">
          <span className="w-14 shrink-0 text-sm font-medium text-slate-400">
            Subject
          </span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="flex-1 bg-transparent py-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your message…"
        rows={12}
        className="min-h-[220px] w-full resize-none px-5 py-4 text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none"
      />
      {touched && body.trim().length === 0 && (
        <p className="px-5 pb-1 text-xs text-red-500">Message body is empty.</p>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
        <Button
          type="submit"
          leftIcon={SendIcon}
          loading={sending}
          disabled={!canSend}
        >
          Send
        </Button>
        <span className="text-xs text-slate-400">
          {to.length} recipient{to.length === 1 ? '' : 's'}
        </span>
      </div>
    </form>
  );
}

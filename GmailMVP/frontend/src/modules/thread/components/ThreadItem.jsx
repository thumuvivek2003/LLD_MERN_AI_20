import { useState } from 'react';
import Avatar from '../../../shared/components/Avatar.jsx';

/**
 * A single message in a conversation timeline. Collapsed by default (Gmail
 * style) showing a snippet; expands to full body on click.
 */
export default function ThreadItem({ mail, isCurrentUser, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="relative pl-12">
      {/* Timeline node */}
      <span className="absolute left-0 top-1">
        <Avatar name={mail.sender?.name} color={mail.sender?.color} size="sm" />
      </span>

      <div
        className={`overflow-hidden rounded-2xl border transition-all ${
          isCurrentUser
            ? 'border-brand-200 bg-brand-50/40'
            : 'border-slate-200 bg-white'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-4 py-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">
              {mail.sender?.name}
              {isCurrentUser && (
                <span className="ml-1.5 text-xs font-normal text-brand-500">
                  (you)
                </span>
              )}
            </p>
            {!open && (
              <p className="truncate text-xs text-slate-400">{mail.snippet}</p>
            )}
          </div>
          <span className="shrink-0 text-xs text-slate-400">
            {mail.shortTime}
          </span>
        </button>

        {open && (
          <div className="animate-fade-in border-t border-slate-100 px-4 py-3">
            <p className="mb-2 text-xs text-slate-400">
              to {mail.receiverNames || '—'} &middot; {mail.fullTime}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {mail.body}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

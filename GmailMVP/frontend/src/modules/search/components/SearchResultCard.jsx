import { useNavigate } from 'react-router-dom';
import Avatar from '../../../shared/components/Avatar.jsx';

// Highlights the matched query term inside a text string.
function Highlight({ text = '', query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-brand-100 px-0.5 text-brand-800">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchResultCard({ mail, query }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/mail/${mail.id}`)}
      className="flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-brand-50/40"
    >
      <Avatar name={mail.sender?.name} color={mail.sender?.color} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-slate-800">
            <Highlight text={mail.sender?.name || ''} query={query} />
          </p>
          <span className="shrink-0 text-xs text-slate-400">
            {mail.shortTime}
          </span>
        </div>
        <p className="truncate text-sm text-slate-700">
          <Highlight text={mail.subject} query={query} />
        </p>
        <p className="truncate text-xs text-slate-400">
          <Highlight text={mail.snippet} query={query} />
        </p>
      </div>
    </div>
  );
}

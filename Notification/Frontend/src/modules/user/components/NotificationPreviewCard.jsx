// Sample renders showing how each channel laysout. Used in Channel Preview.
function EmailPreview({ subject, body }) {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <div className="text-[11px] uppercase text-slate-400">Email</div>
        <div className="text-sm font-semibold text-slate-900 mt-0.5">
          {subject}
        </div>
        <div className="text-[11px] text-slate-500">
          notifications@notify.app
        </div>
      </div>
      <div className="p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {body}
      </div>
    </div>
  );
}

function SmsPreview({ body }) {
  return (
    <div className="max-w-xs rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-slate-800">
      <div className="text-[10px] uppercase text-emerald-700 font-semibold mb-1">
        SMS · Notify
      </div>
      {body}
    </div>
  );
}

function PushPreview({ subject, body }) {
  return (
    <div className="rounded-2xl bg-slate-900 text-white p-4 max-w-sm">
      <div className="flex items-center gap-2 text-[11px] text-slate-300">
        <div className="w-5 h-5 rounded bg-brand-500 flex items-center justify-center text-[10px]">
          N
        </div>
        Notify · now
      </div>
      <div className="text-sm font-semibold mt-2">{subject}</div>
      <div className="text-xs text-slate-300 mt-1">{body}</div>
    </div>
  );
}

// Strategy-on-frontend: channelType → component map.
const PREVIEW_MAP = {
  EMAIL: EmailPreview,
  SMS: SmsPreview,
  PUSH: PushPreview,
};

export function NotificationPreviewCard({ channel, subject, body }) {
  const Component = PREVIEW_MAP[channel] || EmailPreview;
  return <Component subject={subject} body={body} />;
}

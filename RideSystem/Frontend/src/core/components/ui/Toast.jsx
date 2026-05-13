// Toast UI placeholder — actual rendering happens in NotificationContext.
export default function Toast({ title, body }) {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-slate-100 px-4 py-3">
      <p className="text-sm font-semibold">{title}</p>
      {body && <p className="text-xs text-slate-500">{body}</p>}
    </div>
  );
}

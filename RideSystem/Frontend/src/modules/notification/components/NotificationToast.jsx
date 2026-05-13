export default function NotificationToast({ title, body }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-md px-4 py-3">
      <p className="text-sm font-semibold">{title}</p>
      {body && <p className="text-xs text-slate-500">{body}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="border-b border-wa-border px-5 py-3 text-lg font-semibold text-wa-dark">
            {title}
          </div>
        ) : null}
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-wa-border px-5 py-3">
            {footer}
          </div>
        ) : (
          <div className="flex justify-end gap-2 border-t border-wa-border px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-3 py-1.5 text-sm text-wa-muted hover:bg-wa-light"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

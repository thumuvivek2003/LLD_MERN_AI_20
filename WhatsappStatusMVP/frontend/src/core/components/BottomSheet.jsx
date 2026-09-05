// core/components/BottomSheet.jsx — Modal presented as a bottom sheet.
// Used for privacy selection, viewers list, delete confirm, etc.
export function BottomSheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-wa-panel rounded-t-2xl max-h-[85%] overflow-hidden flex flex-col animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-wa-line" />
        </div>
        {title && <h3 className="px-5 pt-3 pb-2 text-base font-semibold">{title}</h3>}
        <div className="overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}

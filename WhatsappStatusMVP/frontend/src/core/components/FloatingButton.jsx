// core/components/FloatingButton.jsx — the round FAB (camera / compose).
export function FloatingButton({ onClick, icon = 'camera', label = 'Create status' }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="absolute bottom-20 right-4 h-14 w-14 rounded-2xl bg-wa-green text-wa-ink grid place-items-center shadow-lg shadow-wa-green/30 hover:brightness-105 active:scale-95 transition"
    >
      {icon === 'camera' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

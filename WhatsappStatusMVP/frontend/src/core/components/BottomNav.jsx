// core/components/BottomNav.jsx — WhatsApp-style Chats / Status / Calls tabs.
// Status is the only active tab in this MVP; the others are decorative.
const Tab = ({ icon, label, active }) => (
  <div className={`flex-1 flex flex-col items-center gap-1 py-2 ${active ? 'text-wa-green' : 'text-wa-muted'}`}>
    {icon}
    <span className="text-[11px] font-medium">{label}</span>
  </div>
);

export function BottomNav() {
  return (
    <nav className="h-16 bg-wa-panel border-t border-wa-line flex items-center px-2 shrink-0">
      <Tab
        label="Chats"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
      <Tab
        active
        label="Status"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3">
            <circle cx="12" cy="12" r="9" />
          </svg>
        }
      />
      <Tab
        label="Calls"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
    </nav>
  );
}

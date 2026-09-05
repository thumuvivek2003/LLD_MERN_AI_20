// modules/status/pages/CreateStatusPage.jsx — Screens 3,4,5,6,7.
// Full text-status composer: colored background, privacy sheet, contact
// selector, send, and the "Status sent" success screen.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateStatus } from '../hooks/useCreateStatus.js';
import { StatusPrivacySelector } from '../components/StatusPrivacySelector.jsx';
import { PrivacyUserSelector } from '../components/PrivacyUserSelector.jsx';
import { statusBgClass } from '../../../core/utils/color.util.js';
import { PRIVACY, PRIVACY_SHORT } from '../../../core/constants/privacy.constants.js';
import { Button } from '../../../core/components/Button.jsx';
import { ROUTES } from '../../../core/constants/routes.constants.js';

export function CreateStatusPage() {
  const navigate = useNavigate();
  const c = useCreateStatus();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [userSelectMode, setUserSelectMode] = useState(null); // CONTACTS_EXCEPT | ONLY_SHARE_WITH | null
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (await c.submit()) setSent(true);
  };

  // ── Screen 7: success ───────────────────────────────────────────────
  if (sent) {
    return (
      <div className={`h-full flex flex-col items-center justify-center text-center px-8 ${statusBgClass(c.background)}`}>
        <div className="h-20 w-20 rounded-full bg-white/20 grid place-items-center animate-pop">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-white text-2xl font-bold mt-6">Your status has been sent</h2>
        <p className="text-white/70 mt-2">It will disappear after 24 hours.</p>
        <div className="mt-8 w-full max-w-[220px]">
          <Button className="w-full" onClick={() => navigate(ROUTES.FEED, { replace: true })}>Done</Button>
        </div>
      </div>
    );
  }

  // ── Screen 3: composer ──────────────────────────────────────────────
  return (
    <div className={`h-full flex flex-col relative ${statusBgClass(c.background)}`}>
      {/* top bar */}
      <div className="flex items-center justify-between px-3 h-14 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 text-white" aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
        </button>
        <div className="flex items-center gap-1">
          <span className="px-3 py-1.5 text-white/90 text-sm font-semibold">T</span>
          <button onClick={c.cycleBackground} className="p-2 rounded-full hover:bg-white/10 text-white" aria-label="Change background" title="Change background">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18c1.7 0 2-1 2-2s-.5-1.5-.5-2 .5-1 1.5-1H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9z"/></svg>
          </button>
        </div>
      </div>

      {/* text area */}
      <div className="flex-1 grid place-items-center px-8">
        <textarea
          autoFocus
          value={c.text}
          onChange={(e) => c.setText(e.target.value)}
          placeholder="Type a status"
          rows={4}
          className="w-full bg-transparent text-white text-3xl font-semibold text-center placeholder-white/50 outline-none resize-none"
        />
      </div>

      {c.error && <p className="text-center text-red-200 text-sm pb-2">{c.error}</p>}

      {/* bottom controls: privacy chip + send */}
      <div className="flex items-center justify-between px-4 pb-6 pt-2 shrink-0">
        <button
          onClick={() => setPrivacyOpen(true)}
          className="flex items-center gap-2 bg-black/30 text-white rounded-full pl-3 pr-4 py-2 text-sm font-medium backdrop-blur"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 1a11 11 0 0 0-11 11 11 11 0 0 0 11 11 11 11 0 0 0 11-11A11 11 0 0 0 12 1z" opacity="0"/></svg>
          Status ({PRIVACY_SHORT[c.privacy]})
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <button
          onClick={handleSend}
          disabled={!c.canSubmit}
          className="h-12 w-12 rounded-full bg-wa-green text-wa-ink grid place-items-center shadow-lg disabled:opacity-40 active:scale-95 transition"
          aria-label="Send status"
        >
          {c.submitting ? (
            <span className="h-5 w-5 rounded-full border-2 border-wa-ink/40 border-t-wa-ink animate-spin" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg>
          )}
        </button>
      </div>

      {/* Screen 4 */}
      <StatusPrivacySelector
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        privacy={c.privacy}
        onChange={c.setPrivacy}
        onNeedUsers={(mode) => {
          setPrivacyOpen(false);
          setUserSelectMode(mode);
        }}
      />

      {/* Screens 5 & 6 */}
      <PrivacyUserSelector
        open={!!userSelectMode}
        mode={userSelectMode}
        onClose={() => setUserSelectMode(null)}
        selected={userSelectMode === PRIVACY.CONTACTS_EXCEPT ? c.excludeUsers : c.includeUsers}
        onChange={userSelectMode === PRIVACY.CONTACTS_EXCEPT ? c.setExcludeUsers : c.setIncludeUsers}
      />
    </div>
  );
}

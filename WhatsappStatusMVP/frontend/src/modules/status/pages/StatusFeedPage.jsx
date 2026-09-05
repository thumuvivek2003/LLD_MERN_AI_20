// modules/status/pages/StatusFeedPage.jsx — Screens 2 & 10 (Status feed).
// Composes: header, "My status" row, unseen/seen feed sections, FAB, bottom nav.
import { useNavigate } from 'react-router-dom';
import { useStatusFeed } from '../hooks/useStatusFeed.js';
import { FeedList } from '../components/FeedList.jsx';
import { PageHeader } from '../../../core/components/PageHeader.jsx';
import { Avatar } from '../../../core/components/Avatar.jsx';
import { Loader } from '../../../core/components/Loader.jsx';
import { EmptyState } from '../../../core/components/EmptyState.jsx';
import { Button } from '../../../core/components/Button.jsx';
import { FloatingButton } from '../../../core/components/FloatingButton.jsx';
import { BottomNav } from '../../../core/components/BottomNav.jsx';
import { useAuth } from '../../auth/context/AuthProvider.jsx';
import { ROUTES, toViewer } from '../../../core/constants/routes.constants.js';

export function StatusFeedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { sections, loading, error, isEmpty } = useStatusFeed();

  return (
    <div className="h-full flex flex-col bg-wa-ink relative">
      <PageHeader
        title="Status"
        right={
          <div className="flex items-center gap-1">
            <button onClick={() => navigate(ROUTES.CREATE)} className="p-2 rounded-full hover:bg-wa-panel2 text-wa-muted" aria-label="Camera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <button onClick={logout} className="p-2 rounded-full hover:bg-wa-panel2 text-wa-muted" aria-label="Switch user" title="Switch user">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 17l5-5-5-5M21 12H9M12 19a7 7 0 1 1 0-14"/></svg>
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* My status entry */}
        <button
          onClick={() => navigate(ROUTES.MY_STATUS)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-wa-panel2 transition text-left"
        >
          <div className="relative">
            <Avatar user={user} size={52} />
            <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-wa-green grid place-items-center ring-2 ring-wa-ink">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B141A" strokeWidth="3"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">My status</p>
            <p className="text-xs text-wa-muted">Tap to add or manage your status</p>
          </div>
        </button>

        <div className="h-px bg-wa-line mx-4 my-1" />

        {loading && <Loader label="Loading status feed…" />}
        {error && <p className="text-center text-red-400 text-sm py-8">{error}</p>}
        {!loading && !error && isEmpty && (
          <EmptyState
            icon="📭"
            title="No status updates"
            subtitle="When someone you know shares a status, you'll see it here."
            action={<Button variant="ghost" onClick={() => navigate(ROUTES.CREATE)}>Share a status</Button>}
          />
        )}
        {!loading && !error && !isEmpty && <FeedList sections={sections} onOpen={(id) => navigate(toViewer(id))} />}
      </div>

      <FloatingButton onClick={() => navigate(ROUTES.CREATE)} />
      <BottomNav />
    </div>
  );
}

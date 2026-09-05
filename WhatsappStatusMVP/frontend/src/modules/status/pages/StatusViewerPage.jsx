// modules/status/pages/StatusViewerPage.jsx — Screens 8 & 9 (story viewer).
// Tap left/right to navigate, hold to pause, auto-advance with progress bars.
import { useParams, useNavigate } from 'react-router-dom';
import { useStatusViewer } from '../hooks/useStatusViewer.js';
import { useStatusContext } from '../state/StatusProvider.jsx';
import { StoryProgressBar } from '../components/StoryProgressBar.jsx';
import { StatusCard } from '../components/StatusCard.jsx';
import { Avatar } from '../../../core/components/Avatar.jsx';
import { Loader } from '../../../core/components/Loader.jsx';
import { timeAgo } from '../../../core/utils/date.util.js';
import { ROUTES, toViewer } from '../../../core/constants/routes.constants.js';

export function StatusViewerPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { feed } = useStatusContext();
  const goFeed = () => navigate(ROUTES.FEED, { replace: true });

  // Build the play queue: the users in the SAME feed section (Recent vs Viewed)
  // as the one being viewed, in feed order. Finishing one person rolls into the
  // next person in the queue; only the last person returns to the feed — exactly
  // how WhatsApp chains statuses across contacts.
  const current = feed.find((g) => g.user.id === userId);
  const queue = feed.filter((g) => g.hasUnseen === current?.hasUnseen).map((g) => g.user.id);
  const advanceUser = () => {
    const at = queue.indexOf(userId);
    const nextId = at !== -1 ? queue[at + 1] : undefined;
    if (nextId) navigate(toViewer(nextId), { replace: true });
    else goFeed();
  };

  const v = useStatusViewer(userId, { onExit: advanceUser });

  if (v.loading) return <div className="h-full grid place-items-center bg-black"><Loader label="Loading status…" /></div>;
  if (v.error || !v.current)
    return (
      <div className="h-full grid place-items-center bg-black text-center px-8">
        <div>
          <p className="text-white/80">{v.error || 'No status to show'}</p>
          <button onClick={goFeed} className="mt-4 text-wa-green font-semibold">Back</button>
        </div>
      </div>
    );

  return (
    <div className="h-full relative bg-black select-none">
      <StatusCard status={v.current} />

      {/* top overlay: progress + owner */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/50 to-transparent pb-4">
        <StoryProgressBar count={v.statuses.length} index={v.index} progress={v.progress} />
        <div className="flex items-center gap-3 px-4 pt-3">
          <button onClick={goFeed} className="text-white p-1 -ml-1" aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <Avatar user={v.user} size={38} />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{v.user?.name}</p>
            <p className="text-white/70 text-xs">{timeAgo(v.current.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* tap zones: left = prev, right = next; hold pauses */}
      <button
        className="absolute inset-y-0 left-0 w-1/3 z-10"
        aria-label="Previous"
        onClick={v.prev}
        onPointerDown={v.pause}
        onPointerUp={v.resume}
        onPointerLeave={v.resume}
      />
      <button
        className="absolute inset-y-0 right-0 w-2/3 z-10"
        aria-label="Next"
        onClick={v.next}
        onPointerDown={v.pause}
        onPointerUp={v.resume}
        onPointerLeave={v.resume}
      />

      {/* bottom reply bar (decorative — replies are out of MVP scope) */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-5 pt-8 bg-gradient-to-t from-black/50 to-transparent flex items-center gap-3">
        <div className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-white/60 text-sm backdrop-blur">Reply…</div>
        <span className="text-white/80 text-2xl">♡</span>
      </div>
    </div>
  );
}

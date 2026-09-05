// modules/status/pages/MyStatusesPage.jsx — Screen 12 (My status list).
// Shows my active statuses with live viewer counts; tap → viewers, trash →
// delete confirm. Empty state offers to create one.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyStatuses } from '../hooks/useMyStatuses.js';
import { DeleteStatusDialog } from '../components/DeleteStatusDialog.jsx';
import { PageHeader } from '../../../core/components/PageHeader.jsx';
import { Loader } from '../../../core/components/Loader.jsx';
import { EmptyState } from '../../../core/components/EmptyState.jsx';
import { Button } from '../../../core/components/Button.jsx';
import { statusBgClass } from '../../../core/utils/color.util.js';
import { clockTime } from '../../../core/utils/date.util.js';
import { ROUTES, toMyViewers } from '../../../core/constants/routes.constants.js';

export function MyStatusesPage() {
  const navigate = useNavigate();
  const { statuses, loading, remove, isEmpty } = useMyStatuses();
  const [toDelete, setToDelete] = useState(null);

  const confirmDelete = async () => {
    const id = toDelete;
    setToDelete(null);
    await remove(id);
  };

  return (
    <div className="h-full flex flex-col bg-wa-ink relative">
      <PageHeader
        title="My status"
        subtitle={loading ? '' : `${statuses.length} update${statuses.length === 1 ? '' : 's'}`}
        onBack={() => navigate(ROUTES.FEED)}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading && <Loader label="Loading your statuses…" />}
        {!loading && isEmpty && (
          <EmptyState
            icon="✍️"
            title="No status yet"
            subtitle="Share what's on your mind — it disappears after 24 hours."
            action={<Button onClick={() => navigate(ROUTES.CREATE)}>Create status</Button>}
          />
        )}
        {!loading &&
          statuses.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-wa-panel2 transition">
              <button onClick={() => navigate(toMyViewers(s.id))} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div className={`h-12 w-12 rounded-lg grid place-items-center text-white text-xs font-semibold overflow-hidden shrink-0 ${statusBgClass(s.background)}`}>
                  <span className="line-clamp-2 px-1 text-center leading-tight">{s.text.slice(0, 18)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{s.text}</p>
                  <p className="text-xs text-wa-muted flex items-center gap-1.5">
                    <span>{clockTime(s.createdAt)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      {s.viewersCount}
                    </span>
                  </p>
                </div>
              </button>
              <button onClick={() => setToDelete(s.id)} className="p-2 rounded-full hover:bg-wa-line text-wa-muted hover:text-red-400" aria-label="Delete status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
      </div>

      {!loading && !isEmpty && (
        <div className="p-4 border-t border-wa-line">
          <Button className="w-full" onClick={() => navigate(ROUTES.CREATE)}>Add new status</Button>
        </div>
      )}

      <DeleteStatusDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
}

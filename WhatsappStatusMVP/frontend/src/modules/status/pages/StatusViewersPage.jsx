// modules/status/pages/StatusViewersPage.jsx — Screen 11 (Viewers list).
// Owner-only: who has seen a specific status of mine.
import { useParams, useNavigate } from 'react-router-dom';
import { useViewers } from '../hooks/useViewers.js';
import { ViewerList } from '../components/ViewerList.jsx';
import { PageHeader } from '../../../core/components/PageHeader.jsx';
import { ROUTES } from '../../../core/constants/routes.constants.js';

export function StatusViewersPage() {
  const { statusId } = useParams();
  const navigate = useNavigate();
  const { viewers, count, loading } = useViewers(statusId);

  return (
    <div className="h-full flex flex-col bg-wa-ink">
      <PageHeader title="Viewed by" onBack={() => navigate(ROUTES.MY_STATUS)} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <ViewerList viewers={viewers} count={count} loading={loading} />
      </div>
    </div>
  );
}

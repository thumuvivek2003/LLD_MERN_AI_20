import { useEffect } from 'react';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { useSendRequest } from '../hooks/useApiConsole.js';
import { useDashboardData } from '../../dashboard/hooks/useDashboard.js';
import { RequestForm } from '../components/RequestForm.jsx';
import { ResponseCard } from '../components/ResponseCard.jsx';
import { QuotaInfoCard } from '../components/QuotaInfoCard.jsx';

export function ApiConsolePage() {
  const user = useAuthStore((s) => s.user);
  const { send, result, loading, error } = useSendRequest();
  const { data: usage, refresh } = useDashboardData('client');

  useEffect(() => {
    if (result) refresh();
  }, [result, refresh]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Send a Request</h2>
        <RequestForm
          defaultApiKey={user?.apiKey || ''}
          onSubmit={send}
          loading={loading}
        />
        <div className="text-[11px] text-slate-400 mt-3">
          POST /api/v1/request with header <code>x-api-key</code>.
        </div>
      </div>

      <div className="space-y-6">
        <ResponseCard result={result} error={error} />
        <QuotaInfoCard usage={usage} />
      </div>
    </div>
  );
}

export default ApiConsolePage;

import { GitCommitVertical } from 'lucide-react';
import objectsApi from '../../../../core/api/objects.api.js';
import auditApi from '../../../../core/api/audit.api.js';
import useAsync from '../../../../core/hooks/useAsync.js';
import { formatDateTime } from '../../../../core/utils/formatters.js';
import { SkeletonText } from '../../../../core/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../../core/components/ui/EmptyState.jsx';
import Badge from '../../../../core/components/ui/Badge.jsx';
import ActivityFeed from '../../components/ActivityFeed.jsx';

/** Edit Object → History. Version timeline (`/versions`) + the object's audit entries. */
export function ObjectHistoryTab({ objectId }) {
  const versions = useAsync(() => objectsApi.versions(objectId), [objectId], { initialData: [] });
  const audit = useAsync(() => auditApi.list({ objectId, limit: 15 }), [objectId], { initialData: [] });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Version history</h3>
        {versions.error ? (
          <ErrorState error={versions.error} onRetry={versions.reload} compact />
        ) : versions.loading ? (
          <SkeletonText lines={6} />
        ) : !versions.data?.length ? (
          <EmptyState
            icon={GitCommitVertical}
            title="No versions recorded"
            description="Publishing or changing the schema creates a new version."
            compact
          />
        ) : (
          <ol className="relative space-y-4 border-l border-slate-200 pl-5">
            {versions.data.map((version) => (
              <li key={version.version} className="relative">
                <span className="absolute -left-[26px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-accent ring-4 ring-accent-soft" />
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="indigo">v{version.version}</Badge>
                  <span className="text-xs text-slate-400">{formatDateTime(version.changedAt)}</span>
                  <span className="text-xs text-slate-400">· {version.changedBy}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{version.summary}</p>
                {version.diff?.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {version.diff.map((change, index) => (
                      <li key={index} className="text-[11px] text-slate-500">
                        • {typeof change === 'string' ? change : JSON.stringify(change)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Audit trail</h3>
        <div className="mf-card overflow-hidden">
          <ActivityFeed
            entries={audit.data}
            loading={audit.loading}
            error={audit.error}
            onRetry={audit.reload}
            emptyTitle="No audit entries for this object"
          />
        </div>
      </section>
    </div>
  );
}

export default ObjectHistoryTab;

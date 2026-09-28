import { useEffect, useState } from 'react';
import { Database, Save, Settings, ToggleRight } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { Input } from '../../../core/components/ui/Input.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { ToggleRow } from '../../../core/components/ui/Toggle.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';

/** Admin screen 19 — Platform settings (backed by `GET/PATCH /system/settings`). */
export function AdminSettingsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => systemApi.settings(), []);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(data), [data]);

  const patch = (changes) => setDraft((current) => ({ ...current, ...changes }));
  const patchFlag = (key, value) =>
    setDraft((current) => ({ ...current, featureFlags: { ...current.featureFlags, [key]: value } }));

  const save = async () => {
    setSaving(true);
    try {
      await systemApi.updateSettings({
        indexingMode: draft.indexingMode,
        cacheTtlSeconds: Number(draft.cacheTtlSeconds),
        auditRetentionDays: Number(draft.auditRetentionDays),
        maxBulkSize: Number(draft.maxBulkSize),
        featureFlags: draft.featureFlags,
      });
      toast.success('Settings saved');
      await reload();
    } catch (err) {
      toast.fromError(err, 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Platform-wide behaviour for indexing, caching and retention"
        icon={Settings}
        actions={
          <Button icon={Save} loading={saving} disabled={!draft} onClick={save}>
            Save Changes
          </Button>
        }
      />

      {error ? (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      ) : loading || !draft ? (
        <Card className="p-6">
          <SkeletonText lines={8} />
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader title="Engine" subtitle="How metadata operations execute" icon={Database} />
            <div className="space-y-4 p-5">
              <div>
                <label className="mf-label">Indexing Mode</label>
                <Select
                  value={draft.indexingMode ?? 'ASYNC'}
                  onChange={(event) => patch({ indexingMode: event.target.value })}
                  options={[
                    { value: 'SYNC', label: 'SYNC — build indexes inline' },
                    { value: 'ASYNC', label: 'ASYNC — queue index builds' },
                  ]}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mf-label">Cache TTL (seconds)</label>
                  <Input
                    type="number"
                    value={draft.cacheTtlSeconds ?? ''}
                    onChange={(event) => patch({ cacheTtlSeconds: event.target.value })}
                  />
                </div>
                <div>
                  <label className="mf-label">Max Bulk Size</label>
                  <Input
                    type="number"
                    value={draft.maxBulkSize ?? ''}
                    onChange={(event) => patch({ maxBulkSize: event.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="mf-label">Audit Retention (days)</label>
                <Input
                  type="number"
                  value={draft.auditRetentionDays ?? ''}
                  onChange={(event) => patch({ auditRetentionDays: event.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Feature Flags" subtitle="Toggle optional platform behaviour" icon={ToggleRight} />
            <div className="px-5">
              {Object.entries(draft.featureFlags || {}).map(([key, value]) => (
                <ToggleRow
                  key={key}
                  title={key}
                  description={`Feature flag "${key}"`}
                  checked={Boolean(value)}
                  onChange={(next) => patchFlag(key, next)}
                />
              ))}
              {!Object.keys(draft.featureFlags || {}).length && (
                <p className="py-6 text-center text-sm text-slate-500">No feature flags exposed.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
              <span>
                Environment <Badge tone="indigo">{draft.environment}</Badge>
              </span>
              <span>
                Version <Badge tone="slate">{draft.version}</Badge>
              </span>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default AdminSettingsPage;

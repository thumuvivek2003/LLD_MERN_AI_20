import { useEffect, useState } from 'react';
import { Save, Settings, ToggleRight } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { Input } from '../../../core/components/ui/Input.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { ToggleRow } from '../../../core/components/ui/Toggle.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { formatDuration } from '../../../core/utils/formatters.js';

/** System → System Settings. The same document the admin console edits, seen from the console. */
export function SystemSettingsPage() {
  const toast = useToast();
  const settings = useAsync(() => systemApi.settings(), []);
  const health = useAsync(() => systemApi.health(), []);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(settings.data), [settings.data]);

  const patch = (changes) => setDraft((current) => ({ ...current, ...changes }));

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
      toast.success('System settings saved');
      await settings.reload();
    } catch (err) {
      toast.fromError(err, 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="System Settings"
        subtitle="Runtime configuration for the metadata engine"
        icon={Settings}
        actions={
          <Button icon={Save} loading={saving} disabled={!draft} onClick={save}>
            Save Changes
          </Button>
        }
      />

      {settings.error ? (
        <Card>
          <ErrorState error={settings.error} onRetry={settings.reload} />
        </Card>
      ) : settings.loading || !draft ? (
        <Card className="p-6">
          <SkeletonText lines={8} />
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader title="Runtime" subtitle="Engine behaviour" icon={Settings} />
            <div className="space-y-4 p-5">
              <div>
                <label className="mf-label" htmlFor="systemsettingspage-indexing-mode">Indexing Mode</label>
                <Select
                  id="systemsettingspage-indexing-mode"
                  value={draft.indexingMode ?? 'ASYNC'}
                  onChange={(event) => patch({ indexingMode: event.target.value })}
                  options={[
                    { value: 'SYNC', label: 'SYNC — build inline with the write' },
                    { value: 'ASYNC', label: 'ASYNC — queue as a background job' },
                  ]}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mf-label" htmlFor="systemsettingspage-cache-ttl-seconds">Cache TTL (seconds)</label>
                  <Input
                    id="systemsettingspage-cache-ttl-seconds"
                    type="number"
                    value={draft.cacheTtlSeconds ?? ''}
                    onChange={(event) => patch({ cacheTtlSeconds: event.target.value })}
                  />
                </div>
                <div>
                  <label className="mf-label" htmlFor="systemsettingspage-max-bulk-size">Max Bulk Size</label>
                  <Input
                    id="systemsettingspage-max-bulk-size"
                    type="number"
                    value={draft.maxBulkSize ?? ''}
                    onChange={(event) => patch({ maxBulkSize: event.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="mf-label" htmlFor="systemsettingspage-audit-retention-days">Audit Retention (days)</label>
                <Input
                  id="systemsettingspage-audit-retention-days"
                  type="number"
                  value={draft.auditRetentionDays ?? ''}
                  onChange={(event) => patch({ auditRetentionDays: event.target.value })}
                />
              </div>
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
              <span>
                Environment <Badge tone="indigo">{draft.environment}</Badge>
              </span>
              <span>
                Version <Badge tone="slate">{draft.version}</Badge>
              </span>
              <span>Uptime {formatDuration(health.data?.uptimeMs)}</span>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Feature Flags" subtitle="Optional engine behaviour" icon={ToggleRight} />
            <div className="px-5">
              {Object.entries(draft.featureFlags || {}).map(([key, value]) => (
                <ToggleRow
                  key={key}
                  title={key}
                  description={`Feature flag "${key}"`}
                  checked={Boolean(value)}
                  onChange={(next) =>
                    patch({ featureFlags: { ...draft.featureFlags, [key]: next } })
                  }
                />
              ))}
              {!Object.keys(draft.featureFlags || {}).length && (
                <p className="py-6 text-center text-sm text-slate-500">No feature flags exposed.</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default SystemSettingsPage;

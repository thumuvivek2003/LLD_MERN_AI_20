import { RefreshCw, ShieldCheck } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { BarChart, colorAt } from '../../../core/components/charts/index.js';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatCompact, formatPercent } from '../../../core/utils/formatters.js';
import FailureBars from '../components/FailureBars.jsx';

/** System → Validation Engine. Throughput, success rate and the rules that fail most. */
export function ValidationEnginePage() {
  const stats = useAsync(() => systemApi.validationStats(), []);
  const failures = stats.data?.topFailures || [];

  return (
    <>
      <PageHeader
        title="Validation Engine"
        subtitle="Validation execution metrics across every save"
        icon={ShieldCheck}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={stats.reload}>
            Refresh
          </Button>
        }
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile label="Validations / min" value={formatCompact(stats.data?.perMin)} icon={ShieldCheck} tone="indigo" loading={stats.loading} />
        <KpiTile label="Success Rate" value={formatPercent(stats.data?.successRate)} icon={ShieldCheck} tone="emerald" loading={stats.loading} />
        <KpiTile label="Failed Validations" value={stats.data?.failed ?? 0} icon={ShieldCheck} tone="rose" loading={stats.loading} />
        <KpiTile label="Active Rules" value={stats.data?.activeRules ?? 0} icon={ShieldCheck} tone="sky" loading={stats.loading} />
      </KpiGrid>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Top Validation Failures" subtitle="Which rules reject the most saves" icon={ShieldCheck} />
          <div className="p-5">
            {stats.error ? (
              <ErrorState error={stats.error} onRetry={stats.reload} compact />
            ) : stats.loading ? (
              <SkeletonText lines={5} />
            ) : (
              <FailureBars items={failures} emptyTitle="No validation failures recorded" />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Failure Distribution" subtitle="Same data, as a chart" icon={ShieldCheck} />
          <div className="p-5">
            {failures.length ? (
              <BarChart
                data={failures.map((failure, index) => ({
                  label: failure.rule,
                  value: failure.count,
                  color: colorAt(index),
                }))}
                layout="horizontal"
                height={Math.max(200, failures.length * 44)}
              />
            ) : (
              <EmptyState title="Nothing to chart" description="No failures to visualise." compact />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export default ValidationEnginePage;

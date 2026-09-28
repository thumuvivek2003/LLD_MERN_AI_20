import { Link } from 'react-router-dom';
import {
  Boxes,
  Database,
  FileClock,
  LayoutGrid,
  ListTree,
  Plus,
  Table2,
} from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import auditApi from '../../../core/api/audit.api.js';
import indexesApi from '../../../core/api/indexes.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { Card, CardHeader, CardLinkFooter } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { formatCompact, formatNumber } from '../../../core/utils/formatters.js';
import ActivityFeed from '../components/ActivityFeed.jsx';
import ObjectHealthList from '../components/ObjectHealthList.jsx';
import IndexHealthSummary from '../components/IndexHealthSummary.jsx';

/** Admin screen 1 — 4 KPI tiles + recent activity + object/index health. */
export function AdminDashboardPage() {
  const { objects } = useMetadata();
  const overview = useAsync(() => systemApi.overview(), []);
  const activity = useAsync(() => auditApi.list({ limit: 8 }), [], { initialData: [] });
  const indexSummary = useAsync(() => indexesApi.summary(), []);

  const kpi = overview.data || {};

  return (
    <>
      <PageHeader
        title="Platform Overview"
        subtitle="Every custom object, field, record and index on this tenant"
        icon={Boxes}
        actions={
          <>
            <Button as={Link} to="/admin/objects" variant="secondary" icon={LayoutGrid}>
              Browse Objects
            </Button>
            <Button as={Link} to="/admin/objects/new" icon={Plus}>
              New Object
            </Button>
          </>
        }
      />

      <KpiGrid className="mb-6">
        <KpiTile
          label="Objects"
          value={formatNumber(kpi.objects ?? objects.length)}
          hint="Total objects"
          icon={LayoutGrid}
          tone="indigo"
          loading={overview.loading}
          to="/admin/objects"
        />
        <KpiTile
          label="Fields"
          value={formatNumber(kpi.fields)}
          hint="Total fields"
          icon={ListTree}
          tone="sky"
          loading={overview.loading}
          to="/admin/fields"
        />
        <KpiTile
          label="Records"
          value={formatCompact(kpi.records)}
          hint="Total records"
          icon={Table2}
          tone="emerald"
          loading={overview.loading}
          to="/admin/records"
        />
        <KpiTile
          label="Indexes"
          value={formatNumber(kpi.indexes)}
          hint="Active indexes"
          icon={Database}
          tone="amber"
          loading={overview.loading}
          to="/admin/indexes"
        />
      </KpiGrid>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent Activity"
            subtitle="Latest changes across the platform"
            icon={FileClock}
            actions={
              <Button as={Link} to="/admin/audit" variant="ghost" size="sm">
                View all
              </Button>
            }
          />
          <ActivityFeed
            entries={activity.data}
            loading={activity.loading}
            error={activity.error}
            onRetry={activity.reload}
          />
          <CardLinkFooter>
            <Link to="/admin/audit" className="mf-link">
              Open audit log →
            </Link>
          </CardLinkFooter>
        </Card>

        <div className="space-y-5">
          <IndexHealthSummary
            summary={indexSummary.data}
            loading={indexSummary.loading}
            error={indexSummary.error}
            onRetry={indexSummary.reload}
          />
          <ObjectHealthList objects={objects} />
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;

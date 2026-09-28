import { Link } from 'react-router-dom';
import { Clock, LayoutGrid } from 'lucide-react';
import useWorkspace from '../hooks/useWorkspace.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { formatCompact, formatRelative } from '../../../core/utils/formatters.js';
import { objectColorClass, resolveIcon } from '../../../core/utils/icons.js';
import cx from '../../../core/utils/cx.js';

/** Business sidebar → Recent. Objects opened most recently, newest first. */
export function RecentPage() {
  const { loading, error, reload } = useMetadata();
  const { recent, recentObjects } = useWorkspace();

  const rows = recentObjects.map((object) => ({
    ...object,
    viewedAt: recent.find((item) => item.objectId === object.objectId)?.at,
  }));

  const columns = [
    {
      key: 'label',
      header: 'Object',
      render: (object) => {
        const Icon = resolveIcon(object.icon);
        return (
          <Link
            to={`/business/objects/${object.objectId}/records`}
            className="flex items-center gap-2.5 font-semibold text-slate-800 hover:text-accent"
          >
            <span
              className={cx(
                'flex h-7 w-7 items-center justify-center rounded-md ring-1',
                objectColorClass(object.color),
              )}
            >
              <Icon size={14} />
            </span>
            {object.pluralLabel || object.label}
          </Link>
        );
      },
    },
    { key: 'recordCount', header: 'Records', render: (object) => formatCompact(object.recordCount) },
    { key: 'viewedAt', header: 'Last Viewed', render: (object) => formatRelative(object.viewedAt) },
  ];

  return (
    <>
      <PageHeader title="Recent" subtitle="Objects you opened recently" icon={Clock} />

      <Card>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(object) => object.objectId}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyIcon={Clock}
          emptyTitle="Nothing opened yet"
          emptyDescription="Open an object and it will be remembered here."
          emptyAction={
            <Button as={Link} to="/business/objects" size="sm" icon={LayoutGrid}>
              Browse My Objects
            </Button>
          }
        />
      </Card>
    </>
  );
}

export default RecentPage;

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Star } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import usePermission from '../../../core/hooks/usePermission.js';
import useWorkspace from '../hooks/useWorkspace.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import SearchInput from '../../../core/components/ui/SearchInput.jsx';
import { SegmentedControl } from '../../../core/components/ui/Tabs.jsx';
import ObjectGrid from '../../../core/components/layout/ObjectGrid.jsx';
import { formatCompact, formatDate } from '../../../core/utils/formatters.js';
import { objectColorClass, resolveIcon } from '../../../core/utils/icons.js';
import cx from '../../../core/utils/cx.js';

const VIEW_OPTIONS = [
  { value: 'list', label: 'List view', icon: LayoutGrid },
  { value: 'grid', label: 'Grid view', icon: LayoutGrid },
];

/** Business screen 2 — every object this user can access. */
export function MyObjectsPage() {
  const { objects, loading, error, reload } = useMetadata();
  const permission = usePermission();
  const { isFavorite, toggleFavorite } = useWorkspace();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');

  const accessible = useMemo(
    () => objects.filter((object) => permission.can('read', object.objectId)),
    [objects, permission],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return accessible;
    return accessible.filter(
      (object) =>
        object.label.toLowerCase().includes(term) ||
        object.description?.toLowerCase().includes(term),
    );
  }, [accessible, search]);

  const columns = [
    {
      key: 'label',
      header: 'Object Name',
      render: (object) => {
        const Icon = resolveIcon(object.icon);
        return (
          <span className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Toggle favorite"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                toggleFavorite(object.objectId);
              }}
              className={cx(
                'shrink-0 rounded p-0.5 transition',
                isFavorite(object.objectId)
                  ? 'text-amber-400 hover:text-amber-500'
                  : 'text-slate-300 hover:text-slate-400',
              )}
            >
              <Star size={14} fill={isFavorite(object.objectId) ? 'currentColor' : 'none'} />
            </button>
            <span
              className={cx(
                'flex h-7 w-7 items-center justify-center rounded-md ring-1',
                objectColorClass(object.color),
              )}
            >
              <Icon size={14} />
            </span>
            <Link
              to={`/business/objects/${object.objectId}/records`}
              className="font-semibold text-slate-800 hover:text-accent"
            >
              {object.pluralLabel || object.label}
            </Link>
          </span>
        );
      },
    },
    {
      key: 'description',
      header: 'Description',
      render: (object) => object.description || <span className="text-slate-300">—</span>,
    },
    {
      key: 'recordCount',
      header: 'Records',
      render: (object) => formatCompact(object.recordCount),
    },
    {
      key: 'updatedAt',
      header: 'Last Modified',
      render: (object) => formatDate(object.updatedAt),
    },
  ];

  return (
    <>
      <PageHeader
        title="My Objects"
        subtitle="All objects you have access to"
        icon={LayoutGrid}
        actions={<SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />}
      />

      <div className="mb-5 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search objects…" />
      </div>

      {view === 'grid' ? (
        <ObjectGrid
          objects={filtered}
          loading={loading}
          error={error}
          onRetry={reload}
          linkTo={(object) => `/business/objects/${object.objectId}/records`}
          emptyTitle="No objects available"
          emptyDescription="Ask a platform admin to grant you access to an object."
        />
      ) : (
        <Card>
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(object) => object.objectId}
            loading={loading}
            error={error}
            onRetry={reload}
            emptyIcon={LayoutGrid}
            emptyTitle={search ? 'No objects match your search' : 'No objects available'}
            emptyDescription={
              search
                ? 'Try a different term.'
                : 'Ask a platform admin to grant you access to an object.'
            }
          />
        </Card>
      )}
    </>
  );
}

export default MyObjectsPage;

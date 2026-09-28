import { Link } from 'react-router-dom';
import { Bookmark, Clock, LayoutGrid, Star, Table2 } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useUser } from '../../../core/context/UserContext.jsx';
import useAsync from '../../../core/hooks/useAsync.js';
import { viewsApi } from '../../../core/api/search.api.js';
import useWorkspace from '../hooks/useWorkspace.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { EmptyState } from '../../../core/components/ui/EmptyState.jsx';
import { formatCompact, formatRelative } from '../../../core/utils/formatters.js';
import { objectColorClass, resolveIcon } from '../../../core/utils/icons.js';
import cx from '../../../core/utils/cx.js';

/** Business screen 1 — welcome header, 4 KPI tiles, Recently Opened, My Favorites. */
export function BusinessDashboardPage() {
  const { me } = useUser();
  const { objects, loading } = useMetadata();
  const { favoriteObjects, recent, recentObjects } = useWorkspace();
  const views = useAsync(() => viewsApi.list(), [], { initialData: [] });

  const totalRecords = objects.reduce((sum, object) => sum + (object.recordCount ?? 0), 0);
  const savedViews = Array.isArray(views.data) ? views.data : [];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${me?.name?.split(' ')[0] ?? 'there'} 👋`}
        subtitle="Here's what's happening with your data."
      />

      <KpiGrid className="mb-6">
        <KpiTile
          label="My Objects"
          value={objects.length}
          hint="Objects I can access"
          icon={LayoutGrid}
          tone="emerald"
          loading={loading}
          to="/business/objects"
        />
        <KpiTile
          label="Total Records"
          value={formatCompact(totalRecords)}
          hint="Across all objects"
          icon={Table2}
          tone="indigo"
          loading={loading}
          to="/business/objects"
        />
        <KpiTile
          label="Saved Views"
          value={savedViews.length}
          hint="Quick access queries"
          icon={Bookmark}
          tone="sky"
          loading={views.loading}
          to="/business/views"
        />
        <KpiTile
          label="Favorites"
          value={favoriteObjects.length}
          hint="Starred objects"
          icon={Star}
          tone="amber"
          to="/business/favorites"
        />
      </KpiGrid>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recently Opened"
            subtitle="Jump back into what you were working on"
            icon={Clock}
            actions={
              <Link to="/business/recent" className="text-xs font-semibold text-accent hover:underline">
                View all
              </Link>
            }
          />
          {recentObjects.length ? (
            <ul className="divide-y divide-slate-50">
              {recentObjects.slice(0, 5).map((object) => {
                const entry = recent.find((item) => item.objectId === object.objectId);
                return (
                  <ObjectRow
                    key={object.objectId}
                    object={object}
                    hint={entry ? `Viewed ${formatRelative(entry.at)}` : ''}
                  />
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={Clock}
              title="Nothing opened yet"
              description="Objects you open will be listed here for quick access."
              compact
            />
          )}
        </Card>

        <Card>
          <CardHeader
            title="My Favorites"
            subtitle="Objects you starred"
            icon={Star}
            actions={
              <Link to="/business/favorites" className="text-xs font-semibold text-accent hover:underline">
                View all
              </Link>
            }
          />
          {favoriteObjects.length ? (
            <ul className="divide-y divide-slate-50">
              {favoriteObjects.slice(0, 5).map((object) => (
                <ObjectRow
                  key={object.objectId}
                  object={object}
                  hint={`${formatCompact(object.recordCount)} records`}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Star}
              title="No favorites yet"
              description="Star an object from My Objects to pin it here."
              compact
            />
          )}
        </Card>
      </div>
    </>
  );
}

function ObjectRow({ object, hint }) {
  const Icon = resolveIcon(object.icon);
  return (
    <li>
      <Link
        to={`/business/objects/${object.objectId}/records`}
        className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/70"
      >
        <span
          className={cx(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1',
            objectColorClass(object.color),
          )}
        >
          <Icon size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-800">
            {object.pluralLabel || object.label}
          </span>
          <span className="block truncate text-[11px] text-slate-400">{hint}</span>
        </span>
      </Link>
    </li>
  );
}

export default BusinessDashboardPage;

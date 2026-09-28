import { Link } from 'react-router-dom';
import { Archive, ArchiveRestore, Copy, Pencil, Share2 } from 'lucide-react';
import { Card } from '../../../../core/components/ui/Card.jsx';
import { resolveIcon } from '../../../../core/utils/icons.js';
import cx from '../../../../core/utils/cx.js';

/** The Actions + Quick Links rail beside the business record detail (mockup screen 4). */
export function RecordActionsRail({
  objectId,
  recordId,
  isActive,
  permission,
  related = [],
  onClone,
  onShare,
  onArchive,
  onRestore,
  busy,
}) {
  const actions = [
    permission.canUpdate && {
      key: 'edit',
      label: 'Edit Record',
      icon: Pencil,
      to: `/business/objects/${objectId}/records/${recordId}/edit`,
    },
    permission.canCreate && { key: 'clone', label: 'Clone Record', icon: Copy, onClick: onClone },
    { key: 'share', label: 'Share Record', icon: Share2, onClick: onShare },
    isActive
      ? permission.canDelete && {
          key: 'archive',
          label: 'Archive Record',
          icon: Archive,
          onClick: onArchive,
          danger: true,
        }
      : permission.canUpdate && {
          key: 'restore',
          label: 'Restore Record',
          icon: ArchiveRestore,
          onClick: onRestore,
        },
  ].filter(Boolean);

  return (
    <aside className="space-y-5">
      <Card className="p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">Actions</p>
        <ul className="space-y-0.5">
          {actions.map((action) => {
            const Icon = action.icon;
            const className = cx(
              'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition',
              action.danger
                ? 'text-rose-600 hover:bg-rose-50'
                : 'text-accent hover:bg-accent-soft',
              busy && 'pointer-events-none opacity-60',
            );
            return (
              <li key={action.key}>
                {action.to ? (
                  <Link to={action.to} className={className}>
                    <Icon size={15} />
                    {action.label}
                  </Link>
                ) : (
                  <button type="button" onClick={action.onClick} className={className}>
                    <Icon size={15} />
                    {action.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {related.length > 0 && (
        <Card className="p-4">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Quick Links
          </p>
          <ul className="space-y-0.5">
            {related.map((group) => {
              const Icon = resolveIcon(group.icon);
              return (
                <li key={group.objectId}>
                  <Link
                    to={`/business/objects/${objectId}/records/${recordId}?tab=related`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-accent transition hover:bg-accent-soft"
                  >
                    <Icon size={15} />
                    {group.label} ({group.count})
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </aside>
  );
}

export default RecordActionsRail;

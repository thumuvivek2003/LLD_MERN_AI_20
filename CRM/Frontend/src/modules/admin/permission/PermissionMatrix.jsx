import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import permissionsApi from '../../../core/api/permissions.api.js';
import useAsync from '../../../core/hooks/useAsync.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { OBJECT_PERMISSION_LIST } from '../../../shared/enums/permission.enum.js';
import { Toggle } from '../../../core/components/ui/Toggle.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';
import { grantsFromMatrix } from '../../../core/utils/permission.js';

/** Object × permission grid for one role (`GET/PUT /permissions`). */
export function PermissionMatrix({ roleId }) {
  const toast = useToast();
  const { objects } = useMetadata();
  const [matrix, setMatrix] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => (roleId ? permissionsApi.matrix(roleId) : Promise.resolve(null)),
    [roleId],
  );

  useEffect(() => setMatrix(data), [data]);

  /** Writes an explicit per-object entry seeded from the currently effective grants. */
  const setGrant = (objectId, key, value) =>
    setMatrix((current) => ({
      ...current,
      objects: {
        ...current?.objects,
        [objectId]: { ...grantsFromMatrix(current, objectId), [key]: value },
      },
    }));

  const save = async () => {
    setSaving(true);
    try {
      await permissionsApi.saveMatrix({ roleId, ...matrix });
      toast.success('Permissions saved');
    } catch (err) {
      toast.fromError(err, 'Could not save permissions');
    } finally {
      setSaving(false);
    }
  };

  if (error) return <ErrorState error={error} onRetry={reload} compact />;
  if (loading) return <SkeletonText lines={8} />;
  if (!objects.length) return <EmptyState title="No objects to configure" compact />;

  return (
    <div>
      <div className="mf-scroll-x">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Object
              </th>
              {OBJECT_PERMISSION_LIST.map((permission) => (
                <th
                  key={permission.key}
                  className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  {permission.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {objects.map((object) => {
              const Icon = resolveIcon(object.icon);
              const grants = grantsFromMatrix(matrix, object.objectId);
              return (
                <tr key={object.objectId} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2 font-semibold text-slate-800">
                      <Icon size={14} className="text-slate-400" />
                      {object.label}
                    </span>
                  </td>
                  {OBJECT_PERMISSION_LIST.map((permission) => (
                    <td key={permission.key} className="px-5 py-3 text-center">
                      <Toggle
                        size="sm"
                        checked={Boolean(grants[permission.key])}
                        onChange={(value) => setGrant(object.objectId, permission.key, value)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end border-t border-slate-100 px-5 py-3.5">
        <Button icon={Save} loading={saving} disabled={!matrix} onClick={save}>
          Save Permissions
        </Button>
      </div>
    </div>
  );
}

export default PermissionMatrix;

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import permissionsApi from '../../../../core/api/permissions.api.js';
import useAsync from '../../../../core/hooks/useAsync.js';
import { useToast } from '../../../../core/context/ToastContext.jsx';
import { FIELD_ACCESS, OBJECT_PERMISSION_LIST } from '../../../../shared/enums/permission.enum.js';
import { accessFromMatrix, grantsFromMatrix } from '../../../../core/utils/permission.js';
import Select from '../../../../core/components/ui/Select.jsx';
import Button from '../../../../core/components/ui/Button.jsx';
import { Toggle } from '../../../../core/components/ui/Toggle.jsx';
import { SkeletonText } from '../../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../../core/components/ui/EmptyState.jsx';

/** Edit Object → Permissions. Object grants + per-field access for one role. */
export function ObjectPermissionsTab({ object }) {
  const toast = useToast();
  const roles = useAsync(() => permissionsApi.roles(), [], { initialData: [] });
  const [roleId, setRoleId] = useState('');
  const [matrix, setMatrix] = useState(null);
  const [saving, setSaving] = useState(false);

  const roleList = Array.isArray(roles.data) ? roles.data : [];

  useEffect(() => {
    if (!roleId && roleList.length) setRoleId(roleList[0].roleId);
  }, [roleList, roleId]);

  const permissions = useAsync(
    () => (roleId ? permissionsApi.matrix(roleId) : Promise.resolve(null)),
    [roleId],
  );

  useEffect(() => setMatrix(permissions.data), [permissions.data]);

  const grants = grantsFromMatrix(matrix, object.objectId);

  const setGrant = (key, value) =>
    setMatrix((current) => ({
      ...current,
      objects: {
        ...current?.objects,
        [object.objectId]: { ...grantsFromMatrix(current, object.objectId), [key]: value },
      },
    }));

  const setFieldAccess = (fieldId, value) =>
    setMatrix((current) => ({
      ...current,
      fields: {
        ...current?.fields,
        [object.objectId]: { ...current?.fields?.[object.objectId], [fieldId]: value },
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

  if (roles.error) return <ErrorState error={roles.error} onRetry={roles.reload} />;
  if (roles.loading) return <SkeletonText lines={6} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-64">
          <label className="mf-label" htmlFor="objectpermissionstab-role">Role</label>
          <Select
            id="objectpermissionstab-role"
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            options={roleList.map((role) => ({ value: role.roleId, label: role.name }))}
          />
        </div>
        <Button icon={Save} loading={saving} disabled={!matrix} onClick={save}>
          Save Permissions
        </Button>
      </div>

      {permissions.error ? (
        <ErrorState error={permissions.error} onRetry={permissions.reload} compact />
      ) : permissions.loading ? (
        <SkeletonText lines={8} />
      ) : (
        <>
          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Object access</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {OBJECT_PERMISSION_LIST.map((permission) => (
                <div
                  key={permission.key}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2.5"
                >
                  <span className="text-sm font-medium text-slate-700">{permission.label}</span>
                  <Toggle
                    checked={Boolean(grants[permission.key])}
                    onChange={(value) => setGrant(permission.key, value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Field-level access</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Hidden fields never render; read-only fields render as text in every form.
            </p>
            <ul className="mt-3 divide-y divide-slate-100">
              {(object.fields || []).map((field) => (
                <li key={field.fieldId} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{field.label}</p>
                    <p className="truncate font-mono text-[11px] text-slate-400">{field.apiName}</p>
                  </div>
                  <Select
                    size="sm"
                    className="w-36"
                    value={accessFromMatrix(matrix, object.objectId, field.fieldId)}
                    onChange={(event) => setFieldAccess(field.fieldId, event.target.value)}
                    options={[
                      { value: FIELD_ACCESS.HIDDEN, label: 'Hidden' },
                      { value: FIELD_ACCESS.READ, label: 'Read only' },
                      { value: FIELD_ACCESS.WRITE, label: 'Read / Write' },
                    ]}
                  />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

export default ObjectPermissionsTab;
